from typing import Any
from fastapi import status

class HTTPBaseException(Exception):
    code = status.HTTP_500_INTERNAL_SERVER_ERROR
    message = "Unexpected server error (This should never happen)"
    extra_details: dict[str, Any] | None = None

class Unauthorized(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Unauthorized"

class Forbidden(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "Forbidden"

class MustBeOwner(HTTPBaseException):
    code = status.HTTP_403_FORBIDDEN
    message = "You must be owner of the business to do this action"

class NotImplemented(HTTPBaseException):
    code = status.HTTP_501_NOT_IMPLEMENTED
    message = "Functionality not yet implemented"

class IdAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "ID already in use"

class WaBusinessIdAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = (
        "This WhatsApp business account is already linked to another Wizabot business"
    )

class UsernameAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Username already in use"

class CompaignAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Compaign already in use"

class EmailAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Email address already in use"

class BusinessNameAlreadyinUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "You already have a business with this name"

class TemplateNameAlreadyinUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "You already have a template with this name"

class FailedToAddUserToBusiness(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Failed to add user to business."

class PhoneNumberAlreadyInUse(HTTPBaseException):
    code = status.HTTP_409_CONFLICT
    message = "Phone Number already in use"

class NotFound(HTTPBaseException):
    code = status.HTTP_404_NOT_FOUND
    message = "Not found"

class BadRequest(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Bad request"

class InvalidCredentials(HTTPBaseException):
    code = status.HTTP_401_UNAUTHORIZED
    message = "Invalid credentials"

class MediaNotSupported(HTTPBaseException):
    code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    message = "Media not supported"

class TooMany(HTTPBaseException):
    code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    message = "Too many entities"

class MissingWhatsAppConfig(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Missing WhatsApp Config"

class ValidationError(HTTPBaseException):
    code = status.HTTP_422_UNPROCESSABLE_ENTITY
    message = "Validation error"

class InvalidWAPhoneNumberForCampaign(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid WhatsApp Phone Number chosen for campaign"

class InvalidClientListChosenForCampaign(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid Client list chosen for campaign"

class InvalidTemplateChosenForCampaign(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Invalid Client list chosen for campaign"

class WA_CampaignIsDraft(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Campaign is still draft. Can not be used."

class FailedToScheduleCampaign(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Can not schedule this campaign."

class FailedToPauseCampaign(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "Can not pause this campaign."

class InsufficientWizaCash(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "You do not have enough WizaCash Balance to perform this operation."

class InvalidFileInput(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "missing filename or extension in the file provided"

class UnsupportedKnowledgeFileType(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "This file is not a supported knowledge type"

class InvalidPhoneNumberFormat(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "This phone number is invalid"

    def __init__(self, wrong_phone_number: str):
        self.extra_details = {"wrong_phone_number": wrong_phone_number}

class InvalidClientImportFile(HTTPBaseException):
    code = status.HTTP_400_BAD_REQUEST
    message = "The inputted client's import file (csv or excel) is in the wrong format. Please follow the template provided."

class WA_MediaDownloadError(HTTPBaseException):
    code = 500
    message = "Failed to download whatsapp media"

class WA_MediaUploadError(HTTPBaseException):
    code = 500
    message = "Failed to upload whatsapp media"

class WA_TokenCodeExchangeError(HTTPBaseException):
    code = 500
    message = "Failed to get whatsapp token from code"

class WA_SubscribeToWebhookError(HTTPBaseException):
    code = 500
    message = "Failed to subscribe to webhook"

class WA_PhoneNumberCreationError(HTTPBaseException):
    code = 500
    message = "Failed to create whatsapp phone number"

class WA_PhoneNumberRequestCodeError(HTTPBaseException):
    code = 500
    message = "Failed to send verification code to whatsapp phone number"

class WA_PhoneNumberVerificationCodeError(HTTPBaseException):
    code = 500
    message = "Failed to verify code"

class WA_RegisterPhoneNumberError(HTTPBaseException):
    code = 500
    message = "Failed to register whatsapp phone number"

class WA_UnSubscribeFromWebhookError(HTTPBaseException):
    code = 500
    message = "Failed to unsubscribe from webhook"

class WA_FailedToGetBusinessProfile(HTTPBaseException):
    code = 500
    message = "Failed to get business profile for this phone number"

class WA_FailedToUpdateBusinessProfile(HTTPBaseException):
    code = 500
    message = "Failed to update business profile for this phone number"

class FB_FailedToGetAppToken(HTTPBaseException):
    code = 500
    message = "Failed to get app token"

class FB_FailedToUploadFile(HTTPBaseException):
    code = 500
    message = "Failed to upload file to facebook"

class WA_FailedToCreateTemplate(HTTPBaseException):
    code = 500
    message = "Failed to create WhatsApp Template"

class WA_FailedToCreateTemplateNameUsed(HTTPBaseException):
    code = 409
    message = "Failed to create WhatsApp Template because you already have a template with the same name and language"

class WA_FailedToCreateTemplateNameUsedDeleted(HTTPBaseException):
    code = 409
    message = "Failed to create WhatsApp Template because you have deleted a template with the same name and language. Per WhatsApp guidelines, Try again in 4 weeks or consider creating a new message template."

class WA_FailedToGetTemplates(HTTPBaseException):
    code = 500
    message = "Failed to get WhatsApp Templates"

class WA_FailedToGetTemplate(HTTPBaseException):
    code = 500
    message = "Failed to get WhatsApp Template"

class WA_FailedToDeleteTemplate(HTTPBaseException):
    code = 500
    message = "Failed to delete WhatsApp Template"

class WA_FailedToGetCreditLineId(HTTPBaseException):
    code = 500
    message = "Failed to get credit line id"

class WA_FailedToShareCreditLine(HTTPBaseException):
    code = 500
    message = "Failed to share credit line"
