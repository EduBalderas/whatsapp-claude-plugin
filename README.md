# whatsapp-claude-plugin

## META
- id: whatsapp-claude-plugin
- owner: EduBalderas
- visibility: public
- idioma: mixto
- estado: estable
- tipo: producto
- nivel: L3
  - L0=gobernanza/política
  - L1=marca/metodología
  - L2=flujo/arquitectura
  - L3=producto ejecutable
  - L4=herramienta
- familia: ninguna
- origen: fork
- experimento: no
- nacido_de: Rich627/whatsapp-claude-plugin
- orquestado_por: N/A
- brief_desde: N/A

## OBJETIVO
Canal de WhatsApp para Claude Code: mensajería bidireccional por dispositivo vinculado (Baileys) o por la Cloud API oficial, con control de acceso.

## QUE_CONTIENE
- `server.ts` — servidor MCP en Bun (stdio): conexión, compuerta de acceso, herramientas y cron.
- `lib/` — lógica testeable (cloud-api, cron, menciones, polls, presencia, recibos, sanitizado) y `*.test.ts`.
- `scripts/` — CLI de terminal (`access.ts`, `provider.ts`, `doctor.ts`), `watchdog.sh` y `whisper-transcribe.sh`.
- `skills/` — `/whatsapp-channel:setup`, `:configure`, `:access`, `:doctor`.
- `hooks/hooks.json` y `hooks-handlers/session-start.sh` — onboarding en SessionStart.
- `.claude-plugin/` — plugin `whatsapp-channel` 0.32.0 y marketplace `whatsapp-claude-plugin`.
- Uso: `USAGE.md`, `ACCESS.md`, `docs/cloud-api.md`. Specs internas en `docs/superpowers/`.
- Gobierno de agentes: `AGENTS.md`, `CLAUDE.md`.
- `CONTRIBUTING.md`, `SECURITY.md`, `LICENSE` (Apache-2.0), `patch-baileys.mjs`, `assets/icon.svg`.
- Dependencias: `@modelcontextprotocol/sdk`, `@whiskeysockets/baileys@7.0.0-rc14`, `@inquirer/prompts`, `zod`.

## CARACTERISTICAS
- Proveedor por defecto `baileys`: empareja el teléfono como WhatsApp Web y responde desde ese número.
- Proveedor `cloud-api`: DMs de un número de negocio Meta, webhook HTTPS público y credenciales propias.
- Compuerta común: DM `pairing` (código 1 h), `allowlist` o `disabled`, más políticas por grupo.
- Herramientas en ambos proveedores: `reply`, `react`, `download_attachment`, `status`, `unreplied`, `wait_for_messages`, `catch_up`.
- Solo dispositivo vinculado: `send_poll` (2–12 opciones), `set_presence`, `edit_message`, `mark_read`, `list_groups`, `group_roster`.
- Cloud API: `send_template` con plantilla aprobada. Meta aplica ventana de servicio, políticas y tarifas.
- Medios en ambos sentidos (foto, voz, vídeo, documento, sticker). Transcripción local con mlx-whisper, o Groq/OpenAI.
- Menciones que notifican (teléfono, LID o JID). Personalidad y memoria por grupo en `groups/<jid>/config.md` y `memory.md`.
- Cron en la sección `## Cron Jobs` de cada `config.md`. Tareas abiertas en `~/.whatsapp-channel/tasks.md`.
- Aprobación de permisos de Claude desde WhatsApp con reacción 👍 / 👎.
- `catch_up` sin `chat` devuelve conteos por chat y las tareas abiertas. Con `chat` reabre esa conversación.
- Respuestas largas en trozos (`chunkMode` `length` o `newline`) o como documento pasado el umbral.
- Cuentas separadas con `WHATSAPP_STATE_DIR`. Un proceso por directorio (lock singleton); si no hay lock, solo existe `whatsapp_unavailable`.
- Claude Code despierta la sesión con `--dangerously-load-development-channels plugin:whatsapp-channel@whatsapp-claude-plugin`.
- Codex CLI, Gemini CLI y Cursor usan el mismo servidor stdio y leen con `wait_for_messages`, `catch_up` o `unreplied`.
- Alta de acceso por terminal: `bun scripts/access.ts`. El alta exige el código concreto y no es herramienta MCP.
- Estado de ejecución en `~/.whatsapp-channel/` (auth, `access.json`, `messages.jsonl`, inbox). No se versiona.

## FUERA_DE_ALCANCE
- Proyecto de comunidad. Anthropic y Meta no lo fabrican ni lo respaldan.
- Baileys usa el protocolo no oficial de dispositivo vinculado; puede chocar con los términos de WhatsApp.
- Esta Cloud API no cubre grupos, edición, importación de historial o agenda, ni coexistencia con la app Business.
- El plugin no convierte texto libre ni la salida de cron en plantillas de Meta, ni calcula la ventana de 24 h.
- `--channels` no acepta este plugin: no está en la allowlist del research preview.
- El empuje `notifications/claude/channel` es extensión de Claude Code. Codex, Gemini CLI y Cursor no lo reciben.
- El arranque documentado deja activos los prompts de permiso. `--dangerously-skip-permissions` queda fuera.
- Credenciales, `.env` y `.baileys_auth` quedan fuera del modelo y del repositorio.
- El número de negocio no entra solo como owner. En Cloud el owner se fija a mano y `dmPolicy` pasa a `allowlist`.
- Almacén en memoria de claves de mensaje, FIFO, tope 500 (`WHATSAPP_MAX_STORE`).
- Un reinicio brusco puede perder una entrega Cloud ya reconocida y aún no escrita en el log.
- Sin SLA. Los avisos de seguridad van por el advisory privado de GitHub, no por issues públicos.

## RELACIONES
- Fork de [Rich627/whatsapp-claude-plugin](https://github.com/Rich627/whatsapp-claude-plugin). `plugin.json` sigue apuntando a ese upstream.
- Instalación publicada: `claude plugin marketplace add Rich627/whatsapp-claude-plugin`, plugin `whatsapp-channel@whatsapp-claude-plugin`.
- Transporte vinculado: [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) 7.0.0-rc14, parcheado por `patch-baileys.mjs`.
- Transporte oficial: [WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api) (Graph `v26.0` por defecto). Pasos en `docs/cloud-api.md`.
- Cliente principal: [Claude Code](https://code.claude.com/docs/en/plugins). Homepage de este fork: [anthropics/claude-code#36814](https://github.com/anthropics/claude-code/issues/36814).
- Entrega de canal, issues de cliente: [#37933](https://github.com/anthropics/claude-code/issues/37933), [#36477](https://github.com/anthropics/claude-code/issues/36477), [#37633](https://github.com/anthropics/claude-code/issues/37633).
- Clientes MCP de sondeo: Codex CLI, Gemini CLI, Cursor. Registro con ruta absoluta a `bun run --cwd … start`.
- Transcripción: mlx-whisper, `api.groq.com`, `api.openai.com`.
- Licencia [Apache-2.0](./LICENSE). Autor en el manifiesto: Rich627. Owner de CODEOWNERS: `@Rich627`.

## ETIQUETAS
- whatsapp
- claude-code
- mcp
- baileys
- canal
- control-de-acceso
- bun

## TOPICS_GITHUB
- whatsapp
- claude-code
- model-context-protocol
- baileys
- typescript
- bun
