# 🚀 Deploy douguizard.com — Guía paso a paso

> **Tu setup:**
> - GitHub: `dougnuken`
> - Domain: `douguizard.com` (en Cloudflare Registrar ✓)
> - Stack: Next.js 16 + React 19 + Framer Motion + R3F
>
> **Tiempo estimado total: 15 minutos** (más esperar la propagación DNS, que es automática)

---

## 📍 Antes de empezar — Checklist

- [ ] Ya tienes Node.js instalado (`node --version` → ≥ 20)
- [ ] Ya tienes Git instalado (`git --version`)
- [ ] Ya tienes cuenta en https://github.com/dougnuken
- [ ] Ya compraste `douguizard.com` en Cloudflare ✓
- [ ] El proyecto descomprimido está en una carpeta tuya (ej: `~/Projects/douguizard-next`)

---

## ⏱ Paso 1 — Push a GitHub (3 min)

### 1A. Crear el repo vacío en GitHub

1. Abre https://github.com/new
2. Llena así:
   ```
   Repository name: douguizard
   Description: Personal site & CV — Senior Product Designer × AI
   Visibility: Public ●
   ```
3. **NO marques** "Add a README file"
4. **NO marques** "Add .gitignore"
5. **NO marques** "Choose a license"

   ⚠️ **Importante**: el repo debe estar **completamente vacío**. Si agregas README acá, romperás el primer push.

6. Click **"Create repository"**

### 1B. Ejecutar el script automatizado

Abre tu terminal en la carpeta `douguizard-next/`:

```bash
cd ~/Projects/douguizard-next   # o donde la tengas

# Ejecuta el script (te lo dejé preparado en la carpeta del proyecto)
bash deploy-step-1.sh
```

El script te pedirá tu nombre y email solo si nunca has usado git.
Hace todo: `git init`, `git add`, `git commit`, configura el remote.

### 1C. Generar Personal Access Token (PAT) en GitHub

GitHub no acepta passwords desde 2021 — necesitas un token. Lleva 1 minuto:

1. Abre https://github.com/settings/tokens?type=beta
2. Click **"Generate new token"**
3. Llena así:
   ```
   Token name: douguizard-deploy
   Expiration: 90 days (o lo que prefieras)
   Repository access: Only select repositories → douguizard
   Permissions → Repository permissions:
     - Contents: Read and write
   ```
4. Click **"Generate token"**
5. **Copia el token** (empieza con `github_pat_...`) — solo lo verás esta vez

### 1D. Hacer el push

```bash
git push -u origin main
```

- **Username:** `dougnuken`
- **Password:** pega el token que copiaste

✅ Si ves `Branch 'main' set up to track 'origin/main'`, listo.

Verifica visitando: **https://github.com/dougnuken/douguizard** — deberías ver todos tus archivos.

---

## ⏱ Paso 2 — Deploy en Vercel (5 min)

### 2A. Crear cuenta y conectar GitHub

1. Abre https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Autoriza Vercel para acceder a tus repos (le da permiso de lectura, puedes restringirlo a `douguizard` solamente)
4. Acepta términos, completa onboarding (Hobby plan = gratis, perfecto para esto)

### 2B. Importar el proyecto

1. Una vez logueado, ve al dashboard
2. Click **"Add New..." → "Project"**
3. En la lista de tus repos GitHub, busca **`douguizard`** → click **"Import"**
4. Vercel detecta automáticamente que es **Next.js** → no toques nada de la configuración
5. Click **"Deploy"**

### 2C. Esperar el build

Verás logs en vivo. Tarda ~2 minutos:
- Installing dependencies
- Building Next.js
- Generating static pages (9 páginas: home, cv, 5 case studies, etc)
- Deploying

✅ Cuando termina, te muestra una URL tipo `douguizard-abc123.vercel.app` con un confetti 🎉

### 2D. Verificar que funciona

Visita la URL temporal de Vercel y prueba:
- [ ] Home carga con el loader animado
- [ ] Hero con texto "Designing human products for an AI era"
- [ ] Background 3D con estrellas
- [ ] Scroll funciona (smooth scroll)
- [ ] `/cv` carga y el botón "Download PDF" funciona
- [ ] `/work/mercadolibre-andes` carga
- [ ] Click en proyectos del portfolio lleva a su página

❗ Si algo no funciona, **dime exactamente qué** y lo arreglamos antes de seguir al paso 3.

---

## ⏱ Paso 3 — Conectar douguizard.com (5 min)

### 3A. Agregar el dominio en Vercel

1. En Vercel → tu proyecto **douguizard** → **Settings → Domains**
2. En el campo input, escribe: `douguizard.com` → click **"Add"**
3. Vercel te va a mostrar **uno o dos records DNS** para configurar:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   Y a veces también:
   ```
   Type: TXT
   Name: _vercel
   Value: vc-domain-verify=...
   ```

4. **NO cierres** esta pestaña. Vamos a configurar Cloudflare en otra pestaña.

5. En Vercel, también agrega `www.douguizard.com` → click **"Add"** otra vez:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

   Vercel automáticamente redirige `www` → root, así ambos funcionan.

### 3B. Configurar DNS en Cloudflare

1. Abre **otra pestaña** → ve a https://dash.cloudflare.com
2. Click en `douguizard.com` (tu dominio)
3. Sidebar izquierdo → **DNS → Records**
4. **Borra cualquier record existente** que apunte a `@` o `www` (pueden ser CNAMEs por defecto que Cloudflare crea — los identificas porque dicen "Auto" o apuntan a Cloudflare)

5. Click **"Add record"** y crea el primero:
   ```
   Type:           A
   Name:           @
   IPv4 address:   76.76.21.21
   Proxy status:   DNS only ⚠️ (NUBE GRIS, no naranja)
   TTL:            Auto
   ```
   Click **Save**

6. Click **"Add record"** otra vez:
   ```
   Type:           CNAME
   Name:           www
   Target:         cname.vercel-dns.com
   Proxy status:   DNS only ⚠️ (NUBE GRIS, no naranja)
   TTL:            Auto
   ```
   Click **Save**

7. **Si Vercel te pidió un TXT de verificación**, agrégalo también:
   ```
   Type:           TXT
   Name:           _vercel
   Content:        (lo que te dio Vercel, pega tal cual)
   Proxy status:   DNS only
   ```

### ⚠️ Sobre la "nube gris" vs "naranja"

- **Nube naranja** (proxy ON) = Cloudflare actúa como CDN/proxy delante de tu sitio. **Esto rompe Vercel** porque Cloudflare intercepta SSL y cachea agresivamente, conflictando con el Edge runtime de Next.js.
- **Nube gris** (DNS only) = Cloudflare solo resuelve el DNS, no proxea tráfico. Vercel maneja CDN y SSL directamente.

Para Vercel, **siempre nube gris**. Vercel ya tiene CDN global excelente.

---

## ⏱ Paso 4 — Esperar propagación (5 min – 24 hrs)

DNS suele propagar en **5-30 minutos** con Cloudflare (es muy rápido), pero técnicamente puede tomar hasta 24h.

### Cómo verificar que va propagando:

1. **DNSChecker:** https://dnschecker.org → escribe `douguizard.com` → selector "A"
   - Verde con `76.76.21.21` en la mayoría de regiones = listo

2. **En tu terminal:**
   ```bash
   dig douguizard.com +short
   # Debe responder: 76.76.21.21
   ```

3. **En Vercel:** vuelve a Settings → Domains. El status cambiará de:
   - 🟡 "Invalid Configuration" / "Pending"
   - 🟢 **"Valid Configuration"**

   Cuando esté verde, Vercel automáticamente provisiona el certificado HTTPS (Let's Encrypt). Toma ~30 segundos extra.

---

## ⏱ Paso 5 — Verificar y celebrar (1 min)

Visita: **https://douguizard.com**

Checklist final:
- [ ] Carga con HTTPS (candado verde en la barra de URL)
- [ ] El loader 0%→100% aparece
- [ ] Hero tipográfico con animación de slide-up
- [ ] Background 3D con estrellas, anillos, partículas flotantes
- [ ] Scroll smooth (Lenis funcionando)
- [ ] Cursor custom (en desktop)
- [ ] `https://douguizard.com/cv` carga
- [ ] `https://douguizard.com/work/mercadolibre-andes` carga
- [ ] `https://www.douguizard.com` redirige a `https://douguizard.com`

🎉 **¡Vivo!**

---

## 🎁 Bonus — Configuración recomendada después del deploy

Cuando todo esté funcionando, te recomiendo activar esto:

### En Cloudflare:
1. **SSL/TLS → Overview** → modo: **"Full (strict)"** (Vercel ya tiene SSL real)
2. **SSL/TLS → Edge Certificates → Always Use HTTPS** → ON
3. **Email Routing** (sidebar):
   - Habilítalo
   - Crea: `hello@douguizard.com` → forward a tu Gmail personal
   - Resultado: profesionalas tu contacto sin pagar nada por email hosting

### En Vercel:
1. **Analytics → Web Analytics** → Enable (gratis, privacy-first, sin cookies)
2. **Settings → Domains → Set as primary**: marca `douguizard.com` como primario
3. **Settings → Git → Production Branch:** confirma que es `main`

---

## 🔄 Cómo actualizar el sitio después

Cualquier cambio que hagas, este es el flujo:

```bash
# Edita lo que quieras en VS Code o tu editor

# Por ejemplo, agregar nuevo case study en src/data/work.ts

# Commit y push
git add .
git commit -m "feat: add new case study about AI workshops"
git push

# Vercel detecta el push, builda, y deploya en ~2 min automático
# Tu sitio se actualiza solo
```

Cada PR genera un preview URL único — útil cuando quieras revisar antes de mergear.

---

## ❓ Si algo sale mal

| Problema | Solución |
|---|---|
| `git push` pide password y rechaza | Estás usando password en vez de PAT. Genera un Personal Access Token en https://github.com/settings/tokens?type=beta |
| Vercel build falla | Pásame el log y lo arreglamos. Suele ser una versión de Node — Vercel usa Node 22 por defecto |
| Domain queda "Invalid Configuration" en Vercel después de 1 hr | Verifica que la nube en Cloudflare está GRIS (DNS only), no naranja |
| Sitio carga en `vercel.app` pero no en `douguizard.com` | DNS aún no propagó, espera 30 min más, revisa dnschecker.org |
| `https://douguizard.com` da error de certificado | Espera ~5 min después de que Vercel detecte DNS válido — provisiona SSL automático |

Cualquier error que veas, me lo pasas con captura/log y lo solucionamos juntos.

---

**¿Listo? Empieza por el Paso 1.** Cuando termines un paso, vuelve y me dices "Paso 1 listo" para confirmar antes de seguir, o avísame si hay algún tropiezo.
