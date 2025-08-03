🏥 Consultório Médico - Sistema de Agendamento
Este é um projeto fullstack em desenvolvimento para um sistema de agendamento de consultas, utilizando Next.js com App Router. Ele permite o gerenciamento de médicos, pacientes e agendamentos, com autenticação via Google integrada. Backend e frontend estão unificados no mesmo repositório.

🧱 Tecnologias Utilizadas

- Next.js (App Router)
- React 18
- shadcn/ui – Componentes modernos e acessíveis
- Better Auth – Autenticação com suporte ao login com Google
- Zod – Validação de formulários e ações
- React Number Format – Máscaras e formatação de números
- next-safe-action – Comunicação segura e tipada entre client e server
- Day.js – Manipulação de datas e horários

🩺 Funcionalidades

  👤 Autenticação
  
  - Login com Google (via Better Auth)
  - Redirecionamento com base em roles (admin, médico, recepção)

  📋 Cadastro e gerenciamento
  - Pacientes: CRUD completo
  - Médicos: CRUD com horários e datas disponíveis
  - Agendamentos: seleção de médico, horário e paciente
  - Restrições de conflito de horários

💡 Usabilidade

- Interface responsiva e acessível com shadcn/ui
- Formulários validados com Zod

🗓️ Agendamentos

- Seleção de médico → horários disponíveis
- Seleção de paciente
- Formulário com validação e feedback
