# Guia de Publicação na Play Store

## Cats Wallpaper - Instruções Completas

Este documento contém todas as instruções necessárias para publicar o aplicativo Cats Wallpaper na Google Play Store.

---

## Pré-requisitos

Antes de iniciar o processo de publicação, você precisará:

| Item | Descrição | Custo |
|------|-----------|-------|
| Conta de Desenvolvedor Google | Cadastro no Google Play Console | $25 (taxa única) |
| Expo Account | Conta gratuita no Expo | Gratuito |
| EAS CLI | Ferramenta de build do Expo | Gratuito |

---

## Passo 1: Criar Conta de Desenvolvedor Google

1. Acesse [Google Play Console](https://play.google.com/console)
2. Faça login com sua conta Google
3. Clique em "Criar conta de desenvolvedor"
4. Pague a taxa de registro de $25 USD
5. Preencha as informações do desenvolvedor
6. Aguarde a aprovação (geralmente 24-48 horas)

---

## Passo 2: Configurar Expo e EAS

### 2.1 Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2.2 Fazer login no Expo

```bash
eas login
```

### 2.3 Configurar o projeto para build

O arquivo `eas.json` já está configurado no projeto. Verifique se contém:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

---

## Passo 3: Gerar o Build para Android

### 3.1 Build APK (para testes)

```bash
cd /home/ubuntu/cats-wallpaper
eas build --platform android --profile production
```

### 3.2 Build AAB (para Play Store)

Para publicar na Play Store, você precisa de um arquivo AAB:

```bash
eas build --platform android --profile production --local
```

O arquivo será gerado em `./build/` com extensão `.aab`.

---

## Passo 4: Preparar Assets para a Play Store

### 4.1 Screenshots Necessários

Você precisará preparar as seguintes imagens:

| Tipo | Dimensões | Quantidade |
|------|-----------|------------|
| Ícone do App | 512x512 px | 1 |
| Feature Graphic | 1024x500 px | 1 |
| Screenshots Phone | 1080x1920 px | 4-8 |
| Screenshots Tablet (opcional) | 1920x1200 px | 4-8 |

### 4.2 Ícone do App

O ícone já está configurado em:
- `assets/images/icon.png` (1024x1024 px)

### 4.3 Feature Graphic

Crie uma imagem promocional de 1024x500 px com:
- Logo do app
- Nome "Cats Wallpaper"
- Slogan: "Os melhores papéis de parede de gatos"

---

## Passo 5: Criar Listagem na Play Store

### 5.1 Informações do App

| Campo | Valor Sugerido |
|-------|----------------|
| Nome do App | Cats Wallpaper |
| Descrição Curta | Wallpapers de gatos em alta qualidade para seu celular |
| Categoria | Personalização |
| Tags | wallpaper, gatos, cats, papel de parede, fofos |

### 5.2 Descrição Completa

```
🐱 Cats Wallpaper - Os melhores papéis de parede de gatos!

Descubra milhares de wallpapers de gatos em alta qualidade para personalizar seu smartphone.

✨ RECURSOS PRINCIPAIS:

• Feed de Wallpapers - Navegue por uma coleção incrível de fotos de gatos
• Categorias - Encontre gatos fofinhos, engraçados, dormindo, filhotes e mais
• Favoritos - Salve seus wallpapers preferidos
• Download Fácil - Baixe e aplique wallpapers com um toque
• Gerador com IA - Crie wallpapers únicos usando inteligência artificial
• Dark Mode - Interface elegante em modo escuro
• Gratuito - Sem anúncios intrusivos

📱 FÁCIL DE USAR:

1. Navegue pelas categorias
2. Toque em um wallpaper para ver em tela cheia
3. Baixe ou aplique diretamente como papel de parede

🎨 CATEGORIAS DISPONÍVEIS:

• Todos os gatos
• Fofinhos
• Engraçados
• Dormindo
• Filhotes
• Gatos pretos
• Gatos brancos
• Gatos laranja

Baixe agora e transforme seu celular com os wallpapers de gatos mais lindos!
```

---

## Passo 6: Configurar Políticas

### 6.1 Política de Privacidade

Você precisará de uma política de privacidade. Crie uma página web ou use um serviço como:
- [Privacy Policy Generator](https://www.privacypolicygenerator.info/)
- [Termly](https://termly.io/)

### 6.2 Classificação de Conteúdo

- Responda o questionário de classificação no Play Console
- O app deve receber classificação "Livre" (Everyone)

### 6.3 Declarações de Dados

Declare que o app:
- Não coleta dados pessoais sensíveis
- Usa armazenamento local para favoritos
- Acessa a internet para buscar imagens

---

## Passo 7: Submeter para Revisão

1. Faça upload do arquivo AAB no Play Console
2. Preencha todas as informações da listagem
3. Adicione screenshots e assets gráficos
4. Configure preço (Gratuito)
5. Selecione países de distribuição
6. Clique em "Enviar para revisão"

### Tempo de Revisão

A revisão inicial geralmente leva de 1 a 7 dias úteis.

---

## Comandos Úteis

```bash
# Verificar configuração do projeto
eas build:configure

# Build de desenvolvimento
eas build --platform android --profile development

# Build de produção
eas build --platform android --profile production

# Submeter para Play Store (após configurar service account)
eas submit --platform android
```

---

## Suporte

Se tiver dúvidas sobre o processo de publicação:
- [Documentação Expo](https://docs.expo.dev/submit/android/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

---

**Autor:** Manus AI  
**Data:** Dezembro 2025
