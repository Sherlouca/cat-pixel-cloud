# Checklist de Pré-Lançamento: Cats Wallpaper

## Aspectos Legais e Monetização

Este documento apresenta um checklist completo para garantir que o aplicativo Cats Wallpaper esteja em conformidade legal e pronto para monetização antes do lançamento nas lojas de aplicativos.

---

## 1. Documentação Legal Obrigatória

A publicação de aplicativos nas lojas requer documentação legal específica. O Google Play e a App Store exigem que desenvolvedores forneçam políticas claras aos usuários [1].

| Documento | Status | Prioridade | Observações |
|-----------|--------|------------|-------------|
| Política de Privacidade | ⬜ Pendente | **Alta** | Obrigatória para Play Store e App Store |
| Termos de Uso | ⬜ Pendente | **Alta** | Define regras de uso do app |
| Política de Reembolso | ⬜ Pendente | Média | Necessária se houver compras in-app |
| LGPD Compliance | ⬜ Pendente | **Alta** | Obrigatória para usuários brasileiros |

### 1.1 Política de Privacidade

A política de privacidade deve incluir os seguintes pontos, conforme exigido pela LGPD (Lei Geral de Proteção de Dados) [2]:

| Item | Descrição | Incluir |
|------|-----------|---------|
| Dados Coletados | Quais informações o app coleta | ⬜ |
| Finalidade | Para que os dados são usados | ⬜ |
| Compartilhamento | Se dados são compartilhados com terceiros | ⬜ |
| Armazenamento | Onde e por quanto tempo os dados ficam | ⬜ |
| Direitos do Usuário | Como solicitar exclusão de dados | ⬜ |
| Contato do Responsável | Email para questões de privacidade | ⬜ |

**Ferramentas gratuitas para gerar Política de Privacidade:**
- [Termly](https://termly.io/) - Gerador gratuito
- [PrivacyPolicies.com](https://www.privacypolicies.com/) - Templates prontos
- [Iubenda](https://www.iubenda.com/) - Específico para apps

### 1.2 Termos de Uso

Os termos de uso devem cobrir os seguintes aspectos:

| Cláusula | Descrição | Status |
|----------|-----------|--------|
| Licença de Uso | Direitos concedidos ao usuário | ⬜ |
| Restrições | O que o usuário não pode fazer | ⬜ |
| Propriedade Intelectual | Direitos sobre o conteúdo | ⬜ |
| Limitação de Responsabilidade | Isenções do desenvolvedor | ⬜ |
| Rescisão | Condições para encerrar o acesso | ⬜ |
| Jurisdição | Foro para resolução de disputas | ⬜ |

---

## 2. Licenciamento de Conteúdo

O uso de APIs e conteúdo de terceiros requer atenção especial às licenças [3].

### 2.1 APIs Utilizadas no App

| API/Serviço | Licença | Uso Comercial | Status |
|-------------|---------|---------------|--------|
| The Cat API | Gratuita | ✅ Permitido | ✅ OK |
| Gerador de IA (Built-in) | Interno | ✅ Permitido | ✅ OK |
| Expo/React Native | MIT | ✅ Permitido | ✅ OK |

### 2.2 Atribuições Necessárias

| Recurso | Atribuição Requerida | Onde Incluir |
|---------|---------------------|--------------|
| The Cat API | Recomendada (não obrigatória) | Tela "Sobre" ou créditos |
| Ícones MaterialIcons | MIT License | Arquivo de licenças |
| Fontes (se customizadas) | Verificar licença | Arquivo de licenças |

---

## 3. Configuração de Monetização

### 3.1 Modelos de Monetização Disponíveis

| Modelo | Descrição | Complexidade | Receita Estimada |
|--------|-----------|--------------|------------------|
| **App Pago** | Usuário paga para baixar | Baixa | R$ 5-20 por download |
| **Freemium** | Grátis + recursos premium | Média | Variável |
| **Assinatura** | Pagamento recorrente | Alta | R$ 5-15/mês por usuário |
| **Anúncios** | Propagandas no app | Média | R$ 0,01-0,10 por impressão |
| **Híbrido** | Anúncios + Premium sem ads | Média-Alta | Combinado |

### 3.2 Checklist para App Pago

| Item | Descrição | Status |
|------|-----------|--------|
| Definir preço | Escolher valor competitivo | ⬜ |
| Conta de pagamento | Configurar conta bancária no Google | ⬜ |
| Informações fiscais | Preencher dados fiscais na Play Console | ⬜ |
| País de distribuição | Selecionar países onde vender | ⬜ |

### 3.3 Checklist para Compras In-App (se aplicável)

| Item | Descrição | Status |
|------|-----------|--------|
| Criar produtos | Definir itens compráveis na Play Console | ⬜ |
| Integrar SDK | Implementar Google Play Billing | ⬜ |
| Testar compras | Usar ambiente de teste | ⬜ |
| Restaurar compras | Permitir recuperar compras anteriores | ⬜ |

### 3.4 Checklist para Anúncios (se aplicável)

| Item | Descrição | Status |
|------|-----------|--------|
| Criar conta AdMob | Cadastrar no Google AdMob | ⬜ |
| Configurar unidades | Criar banners, intersticiais, etc. | ⬜ |
| Integrar SDK | Implementar react-native-google-mobile-ads | ⬜ |
| Política de anúncios | Seguir diretrizes do AdMob | ⬜ |
| Consentimento GDPR | Implementar para usuários europeus | ⬜ |

---

## 4. Requisitos das Lojas

### 4.1 Google Play Store

| Requisito | Descrição | Status |
|-----------|-----------|--------|
| Conta de Desenvolvedor | Criar conta ($25 taxa única) | ⬜ |
| Ícone do App | 512x512 px, PNG | ✅ Pronto |
| Feature Graphic | 1024x500 px | ⬜ Pendente |
| Screenshots | Mínimo 2, recomendado 8 | ⬜ Pendente |
| Descrição Curta | Até 80 caracteres | ⬜ Pendente |
| Descrição Completa | Até 4000 caracteres | ✅ Pronto |
| Categoria | Personalização | ✅ Definido |
| Classificação Etária | Preencher questionário | ⬜ Pendente |
| Política de Privacidade URL | Link público | ⬜ Pendente |
| Declaração de Dados | Formulário de segurança de dados | ⬜ Pendente |

### 4.2 Declaração de Segurança de Dados (Play Store)

O Google exige declaração detalhada sobre coleta de dados [4]:

| Pergunta | Resposta para Cats Wallpaper |
|----------|------------------------------|
| O app coleta dados do usuário? | Sim (se tiver login) / Não (se local) |
| Dados são criptografados em trânsito? | Sim (HTTPS) |
| Usuário pode solicitar exclusão? | Sim |
| O app compartilha dados com terceiros? | Não |

---

## 5. Aspectos Fiscais e Financeiros

### 5.1 Obrigações Fiscais no Brasil

| Obrigação | Descrição | Aplicável |
|-----------|-----------|-----------|
| MEI | Microempreendedor Individual (até R$ 81k/ano) | ⬜ Verificar |
| CNPJ | Necessário para receber do Google | ⬜ Verificar |
| Nota Fiscal | Emitir para vendas | ⬜ Verificar |
| Imposto de Renda | Declarar receitas | ⬜ Verificar |

### 5.2 Recebimento de Pagamentos

| Plataforma | Método de Pagamento | Valor Mínimo |
|------------|---------------------|--------------|
| Google Play | Transferência bancária | $100 USD |
| App Store | Transferência bancária | $10 USD |

---

## 6. Checklist Final de Lançamento

### 6.1 Antes de Submeter

| Item | Categoria | Status |
|------|-----------|--------|
| Política de Privacidade publicada | Legal | ⬜ |
| Termos de Uso publicados | Legal | ⬜ |
| Conta de desenvolvedor criada | Técnico | ⬜ |
| Build de produção gerado | Técnico | ⬜ |
| Screenshots preparados | Marketing | ⬜ |
| Feature Graphic criado | Marketing | ⬜ |
| Descrição otimizada (ASO) | Marketing | ⬜ |
| Preço definido | Monetização | ⬜ |
| Informações fiscais preenchidas | Financeiro | ⬜ |
| App testado em dispositivos reais | QA | ⬜ |

### 6.2 Após Aprovação

| Item | Descrição | Status |
|------|-----------|--------|
| Monitorar avaliações | Responder reviews dos usuários | ⬜ |
| Acompanhar métricas | Verificar downloads e receita | ⬜ |
| Planejar atualizações | Roadmap de novas features | ⬜ |
| Marketing | Divulgar o app | ⬜ |

---

## 7. Recursos Úteis

### Links Importantes

| Recurso | URL |
|---------|-----|
| Google Play Console | https://play.google.com/console |
| Políticas do Google Play | https://play.google.com/about/developer-content-policy/ |
| AdMob | https://admob.google.com |
| Expo EAS Build | https://docs.expo.dev/build/introduction/ |
| The Cat API Termos | https://thecatapi.com/terms |

---

## Referências

[1]: Google Play Console Help - "Requisitos de listagem de apps" - https://support.google.com/googleplay/android-developer/answer/9859152

[2]: Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018 - https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm

[3]: The Cat API - Terms of Service - https://thecatapi.com/terms

[4]: Google Play - Data Safety Section - https://support.google.com/googleplay/android-developer/answer/10787469

---

**Autor:** Manus AI  
**Data:** Dezembro 2025  
**Versão:** 1.0
