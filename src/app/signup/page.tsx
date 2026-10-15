import { redirect } from "next/navigation";

interface Props {
   searchParams: Promise<{ model?: string }>;
}

// Registration lives on /register now; keep old /signup links working.
export default async function SignUpPage({ searchParams }: Props) {
   const { model } = await searchParams;

   redirect(model ? `/register?model=${encodeURIComponent(model)}` : "/register");
}
