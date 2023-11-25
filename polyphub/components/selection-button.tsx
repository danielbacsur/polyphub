import { Button } from "@/components/ui/button";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export function SelectionButton({
    title,
    description,
    buttonText,
    buttonHref,
  }: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  }) {
    return (
      <div className="flex flex-col space-y-4 lg:space-y-8 text-center">
        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
  
        <p className="px-8 text-sm">
          <Balancer>{description}</Balancer>
        </p>
        <Link href={buttonHref}>
          <div className="hidden md:block">
            <Button>{buttonText}</Button>
          </div>
  
          <div className="block md:hidden">
            <Button size="sm">{buttonText}</Button>
          </div>
        </Link>
      </div>
    );
  }
  