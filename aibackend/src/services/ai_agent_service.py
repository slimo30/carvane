import asyncio
from typing import Dict, Any, List, Optional, TypedDict, Annotated
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.tools import tool
from langchain_core.runnables import RunnableLambda
from src.models.conversation import Conversation, Message, MessageRole
from src.models.payament import Payment, PaymentCreate, PaymentMethod
from src.config import settings
from src.exception import exceptions


class AgentState(TypedDict):
    """State for the AI agent"""
    messages: List[BaseMessage]
    conversation_id: str
    user_id: Optional[str]
    restaurant_id: Optional[str]
    current_task: Optional[str]
    payment_context: Optional[Dict[str, Any]]
    next_action: Optional[str]


class AIAgentService:
    """Service for handling agentic AI interactions"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            api_key=settings.openai_api_key
        )
        self.graph = self._build_agent_graph()
    
    def _build_agent_graph(self) -> StateGraph:
        """Build the LangGraph agent workflow"""
        
        # Define the graph
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("analyze_input", self._analyze_input)
        workflow.add_node("handle_payment", self._handle_payment)
        workflow.add_node("handle_recipe", self._handle_recipe)
        workflow.add_node("handle_general", self._handle_general)
        workflow.add_node("generate_response", self._generate_response)
        
        # Add edges
        workflow.add_edge("analyze_input", "handle_payment")
        workflow.add_edge("analyze_input", "handle_recipe")
        workflow.add_edge("analyze_input", "handle_general")
        workflow.add_edge("handle_payment", "generate_response")
        workflow.add_edge("handle_recipe", "generate_response")
        workflow.add_edge("handle_general", "generate_response")
        workflow.add_edge("generate_response", END)
        
        # Set entry point
        workflow.set_entry_point("analyze_input")
        
        return workflow.compile()
    
    async def _analyze_input(self, state: AgentState) -> AgentState:
        """Analyze user input to determine the appropriate action"""
        
        last_message = state["messages"][-1] if state["messages"] else None
        if not last_message or not isinstance(last_message, HumanMessage):
            state["next_action"] = "handle_general"
            return state
        
        content = last_message.content.lower()
        
        # Determine task type based on keywords
        if any(keyword in content for keyword in ["payment", "paiement", "pay", "chargily", "card", "cash"]):
            state["current_task"] = "payment"
            state["next_action"] = "handle_payment"
        elif any(keyword in content for keyword in ["recipe", "recette", "cook", "cuisiner", "ingredient", "step"]):
            state["current_task"] = "recipe"
            state["next_action"] = "handle_recipe"
        else:
            state["current_task"] = "general"
            state["next_action"] = "handle_general"
        
        return state
    
    async def _handle_payment(self, state: AgentState) -> AgentState:
        """Handle payment-related requests"""
        
        last_message = state["messages"][-1]
        content = last_message.content
        
        # Extract payment information from the message
        payment_context = self._extract_payment_info(content)
        state["payment_context"] = payment_context
        
        # Generate payment response
        payment_response = await self._generate_payment_response(payment_context, state)
        
        # Add AI response to messages
        state["messages"].append(AIMessage(content=payment_response))
        
        return state
    
    async def _handle_recipe(self, state: AgentState) -> AgentState:
        """Handle recipe-related requests"""
        
        last_message = state["messages"][-1]
        content = last_message.content
        
        # Generate recipe response
        recipe_response = await self._generate_recipe_response(content, state)
        
        # Add AI response to messages
        state["messages"].append(AIMessage(content=recipe_response))
        
        return state
    
    async def _handle_general(self, state: AgentState) -> AgentState:
        """Handle general conversation"""
        
        last_message = state["messages"][-1]
        content = last_message.content
        
        # Generate general response
        general_response = await self._generate_general_response(content, state)
        
        # Add AI response to messages
        state["messages"].append(AIMessage(content=general_response))
        
        return state
    
    async def _generate_response(self, state: AgentState) -> AgentState:
        """Generate final response (already handled in specific handlers)"""
        return state
    
    def _extract_payment_info(self, content: str) -> Dict[str, Any]:
        """Extract payment information from user message"""
        
        payment_info = {
            "amount": None,
            "method": None,
            "table_id": None,
            "description": None
        }
        
        # Simple extraction logic (can be enhanced with NLP)
        import re
        
        # Extract amount
        amount_match = re.search(r'(\d+(?:\.\d{2})?)', content)
        if amount_match:
            payment_info["amount"] = float(amount_match.group(1))
        
        # Extract payment method
        if any(word in content.lower() for word in ["card", "carte", "chargily"]):
            payment_info["method"] = PaymentMethod.CHARGILY
        elif any(word in content.lower() for word in ["cash", "espèces", "liquide"]):
            payment_info["method"] = PaymentMethod.CASH
        else:
            payment_info["method"] = PaymentMethod.CHARGILY  # Default
        
        # Extract table ID
        table_match = re.search(r'table\s*(\d+)', content.lower())
        if table_match:
            payment_info["table_id"] = f"T-{table_match.group(1)}"
        
        return payment_info
    
    async def _generate_payment_response(self, payment_context: Dict[str, Any], state: AgentState) -> str:
        """Generate payment-specific response"""
        
        if not payment_context.get("amount"):
            return "Je peux vous aider avec le paiement. Pouvez-vous me dire le montant et la méthode de paiement souhaitée ?"
        
        # Create payment record
        payment_data = PaymentCreate(
            amount=payment_context["amount"],
            method=payment_context["method"],
            user_id=state.get("user_id"),
            restaurant_id=state.get("restaurant_id"),
            table_id=payment_context.get("table_id"),
            description=payment_context.get("description", "Paiement via assistant IA")
        )
        
        # Here you would typically create the payment in the database
        # For now, we'll just generate a response
        
        if payment_context["method"] == PaymentMethod.CHARGILY:
            return f"Parfait ! Je vais créer un paiement de {payment_context['amount']} DZD via Chargily. Un lien de paiement sera généré pour la table {payment_context.get('table_id', 'N/A')}."
        else:
            return f"Paiement en {payment_context['method']} de {payment_context['amount']} DZD enregistré pour la table {payment_context.get('table_id', 'N/A')}."
    
    async def _generate_recipe_response(self, content: str, state: AgentState) -> str:
        """Generate recipe-specific response"""
        
        system_prompt = """Vous êtes un assistant culinaire expert. Aidez les cuisiniers avec des recettes, techniques et conseils.
        Répondez en français de manière claire et professionnelle."""
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=content)
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def _generate_general_response(self, content: str, state: AgentState) -> str:
        """Generate general conversation response"""
        
        system_prompt = """Vous êtes un assistant IA pour un restaurant. Vous aidez avec les paiements, recettes, et questions générales.
        Répondez en français de manière amicale et professionnelle."""
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=content)
        ]
        
        response = await self.llm.ainvoke(messages)
        return response.content
    
    async def process_message(
        self, 
        conversation_id: str,
        message_content: str,
        user_id: Optional[str] = None,
        restaurant_id: Optional[str] = None
    ) -> str:
        """Process a user message and return AI response"""
        
        # Get or create conversation
        conversation = await Conversation.get(conversation_id)
        if not conversation:
            conversation = Conversation(
                id=conversation_id,
                user_id=user_id,
                restaurant_id=restaurant_id,
                title="Conversation IA"
            )
            await conversation.insert()
        
        # Add user message
        user_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message_content
        )
        await user_message.insert()
        
        # Prepare state for the agent
        state = {
            "messages": [HumanMessage(content=message_content)],
            "conversation_id": conversation_id,
            "user_id": user_id,
            "restaurant_id": restaurant_id,
            "current_task": None,
            "payment_context": None,
            "next_action": None
        }
        
        # Run the agent
        result = await self.graph.ainvoke(state)
        
        # Get the AI response
        ai_response = result["messages"][-1].content if result["messages"] else "Désolé, je n'ai pas pu traiter votre demande."
        
        # Add AI message to database
        ai_message = Message(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response,
            model_used="gpt-4",
            processing_time=0.0  # Could be calculated
        )
        await ai_message.insert()
        
        # Update conversation
        conversation.message_count += 1
        conversation.last_activity = datetime.utcnow()
        await conversation.save()
        
        return ai_response


# Global instance
ai_agent_service = AIAgentService()
