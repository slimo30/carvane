import { EmployeeDetail } from "@/components/admin/employee-detail"

interface EmployeePageProps {
  params: {
    id: string
  }
}

export default function EmployeePage({ params }: EmployeePageProps) {
  return <EmployeeDetail employeeId={params.id} />
}
