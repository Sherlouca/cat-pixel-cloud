# Cats Wallpaper - Design Document

## Visão Geral

App premium de wallpapers de gatos com interface moderna, Dark Mode como padrão, e funcionalidades avançadas como gerador de IA e sistema de favoritos.

---

## Screen List

### 1. Home (Feed)
Tela principal com grid de wallpapers e categorias.

### 2. Wallpaper Detail
Visualização em tela cheia do wallpaper selecionado com opções de aplicar/favoritar.

### 3. Favorites
Lista de wallpapers salvos pelo usuário.

### 4. AI Generator
Tela para gerar wallpapers personalizados via prompt de texto.

### 5. Profile
Perfil do usuário com configurações e login.

---

## Primary Content and Functionality

### Home Screen
- **Header**: Logo do app + ícone de busca
- **Category Chips**: Filtros horizontais (Todos, Fofinhos, Engraçados, Dormindo, Filhotes, Pretos, Brancos, Laranja)
- **Tabs**: "Populares", "Novos", "Para Você"
- **Grid de Wallpapers**: 2 colunas em mobile, 3-4 em tablet/desktop
- **Cards**: Imagem com aspect ratio 9:16 (formato smartphone), cantos arredondados
- **Pull-to-refresh**: Atualizar feed
- **Infinite scroll**: Carregar mais wallpapers

### Wallpaper Detail Screen
- **Preview em tela cheia**: Imagem ocupa toda a tela
- **Overlay com informações**: 
  - Resolução (ex: 1080x1920)
  - Tamanho do arquivo
  - Paleta de cores extraída
- **Botões de ação**:
  - Favoritar (coração)
  - Download
  - Aplicar como wallpaper (abre opções: tela inicial, bloqueio, ambas)
  - Compartilhar
- **Gesture**: Swipe down para fechar

### Favorites Screen
- **Grid de wallpapers favoritados**
- **Estado vazio**: Ilustração + texto "Nenhum favorito ainda"
- **Sincronização**: Salvos na nuvem (requer login)

### AI Generator Screen
- **Campo de texto**: Prompt para descrever o wallpaper desejado
- **Exemplos de prompts**: Chips clicáveis com sugestões
- **Botão "Gerar"**: Inicia geração
- **Loading state**: Animação enquanto gera (5-20s)
- **Preview do resultado**: Com opções de salvar/regenerar
- **Histórico**: Últimas gerações do usuário

### Profile Screen
- **Avatar e nome** (se logado)
- **Botão de Login/Logout**
- **Estatísticas**: Total de favoritos, wallpapers aplicados
- **Configurações**:
  - Tema (Auto/Claro/Escuro)
  - Qualidade de download (Original/Comprimido)
  - Notificações
- **Sobre o app**: Versão, créditos

---

## Key User Flows

### Flow 1: Descobrir e Aplicar Wallpaper
1. Usuário abre o app → Home Screen
2. Navega pelas categorias ou tabs
3. Toca em um wallpaper → Detail Screen
4. Toca em "Aplicar" → Modal com opções
5. Seleciona "Tela Inicial" → Wallpaper aplicado
6. Feedback de sucesso

### Flow 2: Favoritar Wallpaper
1. Na Detail Screen, toca no ícone de coração
2. Se não logado → Prompt para login
3. Se logado → Wallpaper adicionado aos favoritos
4. Animação de confirmação

### Flow 3: Gerar Wallpaper com IA
1. Usuário vai para aba "AI Generator"
2. Digita prompt (ex: "gato astronauta no espaço")
3. Toca em "Gerar"
4. Aguarda loading (5-20s)
5. Visualiza resultado
6. Pode salvar, compartilhar ou regenerar

### Flow 4: Login
1. Usuário toca em "Profile"
2. Toca em "Entrar"
3. Redirecionado para OAuth
4. Após autenticação, volta ao app
5. Favoritos sincronizados

---

## Color Choices

### Paleta Principal (Dark Mode - Padrão)

| Token | Cor | Uso |
|-------|-----|-----|
| `background` | `#0D0D0D` | Fundo principal |
| `surface` | `#1A1A1A` | Cards, modais |
| `foreground` | `#FFFFFF` | Texto principal |
| `muted` | `#888888` | Texto secundário |
| `primary` | `#FF6B35` | Cor de destaque (laranja gato) |
| `border` | `#2A2A2A` | Bordas e divisores |
| `success` | `#4ADE80` | Ações de sucesso |
| `error` | `#F87171` | Erros |

### Paleta Light Mode

| Token | Cor | Uso |
|-------|-----|-----|
| `background` | `#FFFFFF` | Fundo principal |
| `surface` | `#F5F5F5` | Cards, modais |
| `foreground` | `#1A1A1A` | Texto principal |
| `muted` | `#666666` | Texto secundário |
| `primary` | `#FF6B35` | Cor de destaque |
| `border` | `#E5E5E5` | Bordas |

### Cores Secundárias
- **Gradient overlay**: `rgba(0,0,0,0.6)` para texto sobre imagens
- **Heart icon**: `#FF4757` (vermelho vibrante)
- **Category chips**: `primary` quando ativo, `surface` quando inativo

---

## Layout Responsivo

### Mobile (< 768px)
- **Bottom Navigation**: 4 tabs (Home, Favorites, AI, Profile)
- **Grid**: 2 colunas
- **Header**: Compacto

### Tablet/Desktop (≥ 768px)
- **Sidebar**: Menu lateral fixo à esquerda (280px)
- **Top Bar**: Barra superior com busca
- **Grid**: 3-4 colunas
- **No bottom nav**: Navegação pela sidebar

---

## Componentes Principais

### WallpaperCard
- Imagem com lazy loading
- Aspect ratio 9:16
- Cantos arredondados (12px)
- Sombra sutil
- Ícone de favorito no canto

### CategoryChip
- Pill shape
- Texto + ícone opcional
- Estados: default, selected, disabled

### ActionButton
- Ícone + label
- Feedback háptico no press
- Scale animation (0.97)

### ResponsiveShell
- Detecta largura da tela
- Renderiza sidebar ou bottom nav
- Transição suave entre layouts

---

## Integrações

### API Pexels
- Busca de fotos de gatos
- Endpoint: `https://api.pexels.com/v1/search?query=cat`
- Rate limit: 200 requests/hour (gratuito)

### Gerador de IA
- Usa `generateImage` do servidor (built-in)
- Não requer API key externa
- Prompts focados em gatos/wallpapers

### Sistema de Usuários
- OAuth via Manus
- Favoritos salvos no banco de dados
- Sincronização cross-device
