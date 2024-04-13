"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import ImageEditor from "../components/stickerApp/sticker-adder"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          TRILLIONS WILL <br className="hidden sm:inline" />
          TIPPIE!!
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to the Yippie Generator
        </p>
        <Link
        href={siteConfig.links.link}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants()}
      >
        YIPPIE
      </Link>
      </div>
      <div className="flex gap-4 justify-center">
        <ImageEditor />
        
      </div>
      
    </section>
  )
}