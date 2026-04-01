Projeto: calculadora-drywall

- [x] ao abrir o menu de calculos já cria o dw-service[] com id unico
- [ ] ao clicar em salvar o novo serviço é adicionado ao dw-service e o dw-service é salvo em ls
- [ ] antes de salvar o novo serviço é verificado se existe um dw-service com o mesmo id, y: usa o dw-service como base : usa [], então o novo serviço é adicionado em dw-service
- [ ] o serviço é salvo com [id, nome do comodo, ident, largura, length, sType, labor,]
- [ ] ao salvar um novo serviço o sistema percorre dw-service e para cada serviço faz os calculos baseados em sType e salva os itens em uma nova lista temporaria com todos os itens e suas quantidades somadas, os itens dessa liista serão exibidos na tabela contendo quantidade, identificação, preço unico, preço total;

---

Análise da Função calculateCeiling
A tua função está muito bem estruturada, especialmente a lógica de escolher o menor lado para a distribuição dos perfis F530, o que garante maior estabilidade estrutural.

O que está excelente:

Distribuição de F530: O cálculo baseado no espaçamento de 60cm (0.6) e na orientação pelo maior lado é o padrão técnico correto.

Perímetro e Tabicas: A divisão por 3 (tamanho da barra) com ceil é precisa.

Pontos de Atenção para Serviços Reais:

Kits de Suspensão: Estás a usar area \* 2. Na prática, usa-se 1 pendural a cada 1,20m ao longo do perfil F530. O valor 2 por m² é uma margem segura (até um pouco conservadora), o que é bom para não faltar material na obra.

Massa e Fita: Os valores de 0.5kg/m² e 1.5m/m² são médias de mercado. No entanto, em cômodos muito pequenos, o desperdício de massa no balde pode ser maior.

Veredito: Podes usar para orçamentos, mas sempre mantém uma margem de segurança (safety) de pelo menos 1.05 (5%) ou 1.10 (10%) para cortes e perdas de canto. Nunca compres a conta exata, pois um erro de corte numa placa de 1.80m inutiliza uma parte considerável.
