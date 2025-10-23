import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-[var(--ink)] md:text-3xl">{title}</CardTitle>
        {description && (
          <p className="text-sm text-[var(--muted)] md:text-base">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}
