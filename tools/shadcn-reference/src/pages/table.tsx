import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const payments = [
  { status: "paid", email: "m@example.com", name: "Olivia Martin", amount: "+$1,999.00" },
  { status: "pending", email: "k@example.com", name: "Jackson Lee", amount: "+$39.00" },
  { status: "unpaid", email: "t@example.com", name: "Isabella Nguyen", amount: "+$299.00" },
  { status: "paid", email: "w@example.com", name: "William Kim", amount: "+$99.00" },
  { status: "pending", email: "j@example.com", name: "Sofia Davis", amount: "+$1,250.00" },
  { status: "paid", email: "a@example.com", name: "Liam Johnson", amount: "+$79.00" },
]

export default function TablePage() {
  return (
    <div className="w-full max-w-2xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.email}>
              <TableCell className="capitalize">{p.status}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className="text-right">{p.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableCaption>A list of your recent payments.</TableCaption>
      </Table>
    </div>
  )
}
