import { Card, CardContent } from "@/components/ui/card";

export default function CadastroPersonalizado() {
  return (
    <Card>
      <CardContent className="p-8 space-y-4">
        <h2 className="text-2xl font-semibold">Cadastro personalizado</h2>
        <p className="text-muted-foreground">
          Em breve você poderá configurar campos personalizados para o seu perfil do SMARTx.
        </p>
      </CardContent>
    </Card>
  );
}
