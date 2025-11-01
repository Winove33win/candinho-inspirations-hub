import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
      <CardHeader className="space-y-2 border-b border-[var(--divider)] pb-6">
        <CardTitle className="text-2xl font-bold md:text-3xl">{title}</CardTitle>
        {description && (
          <p className="text-sm text-[var(--text-3)] md:text-base">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
}
