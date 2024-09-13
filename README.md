# quizmica-api

url do banco : postgres://igcvgmrl:liicv8hNAwb5W6lczlSdkKc5ytf_uep0@baasu.db.elephantsql.com/igcvgmrl


chat gpt : https://chatgpt.com/share/40872087-f0db-4a9b-b7f0-2b3502dbe2a7

cria um código usando nodejs e javascript com async/await,o código deve expor uma api com um endpoint post /refreshConfig que conecta em um banco sql e através de uma factory gera um json e salva em um outro banco redis o projeto deve usar o apollo graphql e deve ter uma query que busca dados no banco e retorna, uma mutation que recebe login e senha para fazer login e uma subscription. quero grapqh e rest no mesmo serviço refreshConfig é rest. 

isola a conexão com o banco de dados em uma classe, cria uma singleton que faz algo como

Adapters.getSQLConnection() // retorna conexão sql.
Adapaters.getCacheConnection() // retorna conexão com o redis.


segrega tudo em arquivos também.


npm install express apollo-server-express graphql pg ioredis body-parser
