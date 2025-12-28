# Plano de Implementação: Monetização Avançada

**Aplicativo:** Cats Wallpaper  
**Autor:** Manus AI  
**Data:** 28 de Dezembro de 2024

---

## Visão Geral

Este documento apresenta o plano completo para implementar a monetização avançada no aplicativo Cats Wallpaper, começando pela integração do Google Play Billing para processar pagamentos reais de assinaturas. O plano está dividido em 4 fases principais, com estimativas de tempo e requisitos técnicos detalhados.

---

## Fase 1: Google Play Billing (Alta Prioridade)

A integração com o Google Play Billing é o componente mais crítico da monetização, pois permite processar pagamentos reais de assinaturas no Android.

### 1.1 Pré-requisitos

Antes de iniciar a implementação técnica, você precisa completar as seguintes etapas administrativas:

| Requisito | Descrição | Tempo Estimado |
|-----------|-----------|----------------|
| Conta Google Play Console | Criar conta de desenvolvedor e pagar taxa de $25 | 1 dia |
| Dados Bancários | Configurar perfil de pagamento para receber | 1-3 dias |
| Informações Fiscais | Preencher formulários tributários (CPF/CNPJ) | 1 dia |
| App Publicado | O app precisa estar publicado (pode ser em teste interno) | 1-2 dias |

### 1.2 Configuração de Produtos no Google Play Console

Após criar a conta, você precisará configurar os produtos de assinatura:

| Produto | ID do Produto | Preço | Período |
|---------|---------------|-------|---------|
| Cats Premium Mensal | `cats_premium_monthly` | R$ 4,90 | Mensal |
| Cats Premium Anual | `cats_premium_yearly` | R$ 29,90 | Anual |

**Passos para criar produtos:**

1. Acesse o Google Play Console → Seu App → Monetização → Produtos
2. Clique em "Criar assinatura"
3. Preencha o ID do produto (exatamente como na tabela acima)
4. Configure preço, período de teste gratuito (opcional) e benefícios
5. Ative o produto

### 1.3 Implementação Técnica

A implementação técnica envolve instalar a biblioteca `expo-in-app-purchases` e integrar com o sistema de premium existente.

**Dependências necessárias:**

```bash
npx expo install expo-in-app-purchases
```

**Arquivos a serem criados/modificados:**

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `lib/billing.ts` | Criar | Serviço de conexão com Google Play Billing |
| `hooks/use-purchases.ts` | Criar | Hook para gerenciar compras e assinaturas |
| `stores/premium-store.ts` | Modificar | Integrar com billing real |
| `app/premium.tsx` | Modificar | Conectar botões de compra |
| `app.config.ts` | Modificar | Adicionar configurações do billing |

**Fluxo de compra:**

```
Usuário clica "Assinar" 
    → App solicita produtos ao Google Play
    → Google Play exibe tela de pagamento
    → Usuário confirma compra
    → Google Play retorna confirmação
    → App valida recibo no servidor
    → Servidor ativa premium no banco de dados
    → App atualiza estado local
```

### 1.4 Validação de Recibos (Servidor)

Para evitar fraudes, os recibos de compra devem ser validados no servidor antes de ativar o premium.

**Rota a ser criada no servidor:**

```typescript
// server/routers.ts
validatePurchase: protectedProcedure
  .input(z.object({
    purchaseToken: z.string(),
    productId: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // 1. Verificar recibo com Google Play API
    // 2. Se válido, ativar premium no banco
    // 3. Retornar status
  })
```

### 1.5 Testes

O Google Play oferece um ambiente de testes para validar a integração sem cobranças reais.

| Tipo de Teste | Como Fazer |
|---------------|------------|
| Contas de teste | Adicionar emails no Play Console → Configurações → Licença de teste |
| Compras de teste | Usar cartão de teste "Test Card, Always Approves" |
| Assinaturas de teste | Período de renovação acelerado (5 min = 1 mês) |

**Tempo estimado para Fase 1:** 5-7 dias

---

## Fase 2: AdMob Real (Média Prioridade)

Substituir o banner placeholder por anúncios reais do Google AdMob.

### 2.1 Configuração do AdMob

| Passo | Descrição |
|-------|-----------|
| 1 | Criar conta em [admob.google.com](https://admob.google.com) |
| 2 | Adicionar o app (Android e iOS separadamente) |
| 3 | Criar unidades de anúncio (Banner, Intersticial, Recompensado) |
| 4 | Obter App ID e Ad Unit IDs |

### 2.2 IDs de Anúncio

| Tipo | Uso no App | ID de Teste (Desenvolvimento) |
|------|------------|-------------------------------|
| Banner | Rodapé das telas | `ca-app-pub-3940256099942544/6300978111` |
| Intersticial | Após baixar wallpaper | `ca-app-pub-3940256099942544/1033173712` |
| Recompensado | Ganhar geração extra | `ca-app-pub-3940256099942544/5224354917` |

### 2.3 Implementação

```bash
npx expo install expo-ads-admob
```

**Modificações necessárias:**

| Arquivo | Modificação |
|---------|-------------|
| `app.config.ts` | Adicionar `expo-ads-admob` com App ID |
| `components/ad-banner.tsx` | Substituir placeholder por `AdMobBanner` |
| `app/wallpaper/[id].tsx` | Adicionar intersticial após download |

**Tempo estimado para Fase 2:** 2-3 dias

---

## Fase 3: Anúncios Recompensados (Média Prioridade)

Permitir que usuários gratuitos assistam anúncios para ganhar benefícios temporários.

### 3.1 Recompensas Disponíveis

| Ação | Recompensa |
|------|------------|
| Assistir 1 anúncio | +1 geração de IA extra |
| Assistir 3 anúncios | Acesso premium por 1 hora |
| Assistir 1 anúncio | Download em HD (1 wallpaper) |

### 3.2 Implementação

O hook `useAdRewarded` já está preparado em `components/ad-banner.tsx`. Basta integrar com o AdMob real e adicionar a lógica de recompensas.

**Fluxo:**

```
Usuário atinge limite de IA
    → App oferece "Assistir anúncio para +1 geração"
    → Usuário aceita
    → AdMob exibe anúncio recompensado
    → Usuário assiste até o final
    → App incrementa contador de gerações
```

**Tempo estimado para Fase 3:** 1-2 dias

---

## Fase 4: Cupons Promocionais (Baixa Prioridade)

Sistema de códigos de desconto para campanhas de marketing.

### 4.1 Estrutura do Banco de Dados

```sql
CREATE TABLE coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  discount_percent INTEGER, -- ex: 50 para 50% off
  free_days INTEGER, -- ex: 7 para 7 dias grátis
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4.2 Exemplos de Cupons

| Código | Benefício | Uso |
|--------|-----------|-----|
| `WELCOME50` | 50% off no primeiro mês | Novos usuários |
| `CATS7FREE` | 7 dias grátis de premium | Promoção |
| `INFLUENCER` | 1 mês grátis | Parcerias |

**Tempo estimado para Fase 4:** 2-3 dias

---

## Cronograma Resumido

| Fase | Descrição | Duração | Dependências |
|------|-----------|---------|--------------|
| 1 | Google Play Billing | 5-7 dias | Conta Play Console |
| 2 | AdMob Real | 2-3 dias | Conta AdMob |
| 3 | Anúncios Recompensados | 1-2 dias | Fase 2 |
| 4 | Cupons Promocionais | 2-3 dias | Nenhuma |

**Tempo total estimado:** 10-15 dias

---

## Checklist de Implementação

### Fase 1: Google Play Billing
- [ ] Criar conta no Google Play Console ($25)
- [ ] Configurar perfil de pagamento
- [ ] Preencher informações fiscais
- [ ] Publicar app em teste interno
- [ ] Criar produtos de assinatura
- [ ] Instalar expo-in-app-purchases
- [ ] Criar lib/billing.ts
- [ ] Criar hooks/use-purchases.ts
- [ ] Modificar stores/premium-store.ts
- [ ] Modificar app/premium.tsx
- [ ] Criar rota de validação no servidor
- [ ] Testar com contas de teste
- [ ] Testar fluxo completo de compra

### Fase 2: AdMob Real
- [ ] Criar conta no AdMob
- [ ] Adicionar app Android
- [ ] Criar unidade de Banner
- [ ] Criar unidade de Intersticial
- [ ] Criar unidade de Recompensado
- [ ] Instalar expo-ads-admob
- [ ] Configurar app.config.ts
- [ ] Substituir banner placeholder
- [ ] Implementar intersticial após download

### Fase 3: Anúncios Recompensados
- [ ] Integrar useAdRewarded com AdMob
- [ ] Criar UI de oferta de recompensa
- [ ] Implementar lógica de +1 geração
- [ ] Testar fluxo completo

### Fase 4: Cupons Promocionais
- [ ] Criar tabela de cupons no banco
- [ ] Criar rota de validação de cupom
- [ ] Criar UI de entrada de cupom
- [ ] Implementar aplicação de desconto
- [ ] Criar cupons iniciais

---

## Próximo Passo Imediato

Para começar a implementação, o primeiro passo é criar sua conta no Google Play Console:

1. Acesse: https://play.google.com/console
2. Faça login com sua conta Google
3. Pague a taxa de $25 USD
4. Complete o perfil de desenvolvedor

Após criar a conta, me avise e posso começar a implementar o código do Google Play Billing no app.

---

*Documento gerado por Manus AI em 28/12/2024*
