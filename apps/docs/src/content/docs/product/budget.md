---
title: Cost & Budget Tracking
description: Monthly and annual budget tracking and cost estimates.
---

## Infrastructure Costs (Phase 1)

| Category  | Item                | Provider             | Monthly (USD) | Annual (USD) | Notes                      |
| :-------- | :------------------ | :------------------- | :------------ | :----------- | :------------------------- |
| Hosting   | VPS Server          | DigitalOcean/Hetzner | $20           | $240         | 4GB RAM 2vCPU 80GB SSD     |
| Database  | Managed PostgreSQL  | DigitalOcean         | $15           | $180         | 1GB RAM - Basic tier       |
| Storage   | Object Storage      | DigitalOcean Spaces  | $5            | $60          | 50GB storage               |
| Email     | Transactional Email | SendGrid             | $15           | $180         | 10000 emails/month         |
| Backup    | Backup Storage      | Backblaze B2         | $5            | $60          | 100GB backup storage       |
| Domain    | Domain Name         | Namecheap            | ~$1           | $12          | .com domain                |
| **Total** |                     |                      | **~$61**      | **~$732**    | Excluding transaction fees |

## Scaling Costs

| Item        | Cost    | Trigger                                   |
| :---------- | :------ | :---------------------------------------- |
| VPS Upgrade | +$30/mo | Performance bottleneck / High traffic     |
| DB Upgrade  | +$25/mo | Increased data volume / connection limits |
| Email Tier  | +$20/mo | Exceeding 10k emails/month                |

## Development Estimates (if outsourced)

| Role                 | Estimated Cost    | Notes                         |
| :------------------- | :---------------- | :---------------------------- |
| Full-stack Developer | $25,000 - $40,000 | Core system build             |
| UI/UX Designer       | $3,000 - $5,000   | Branding and interface design |
| QA Engineer          | $2,000 - $3,500   | Testing and validation        |
