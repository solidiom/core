import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

export default function DrawerPage() {
  return (
    <div className="w-96">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>
              Set your daily activity goal-calories, walks, and more.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">Drawer body</div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
