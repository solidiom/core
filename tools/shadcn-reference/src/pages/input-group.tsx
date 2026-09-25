import { Search, Github } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export default function InputGroupPage() {
  return (
    <div className="flex max-w-md flex-col gap-3">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search" />
        <InputGroupButton>Search</InputGroupButton>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="https://" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Disabled" disabled />
        <InputGroupButton>
          <Github />
        </InputGroupButton>
      </InputGroup>
    </div>
  )
}
