import readline from "readline-sync";
import { cadastrarUF } from "./actions/uf";
import { cadastrarCidade } from "./actions/cidade";
import {
  cadastrarNoticia,
  listarNoticias,
  noticiasPorEstado,
  agruparNoticias,
} from "./actions/noticia";

export async function menu() {
  while (true) {
    console.log(`
=========== SERVIJA CLI ===========

0 - Cadastrar notícia
1 - Notícias mais recentes
2 - Notícias mais antigas
3 - Notícias por estado
4 - Agrupar por estado
5 - Cadastrar UF
6 - Cadastrar cidade
7 - Sair

==================================
`);

    const op = readline.questionInt("Escolha: ");

    switch (op) {
      case 0:
        await cadastrarNoticia();
        break;
      case 1:
        await listarNoticias("desc");
        break;
      case 2:
        await listarNoticias("asc");
        break;
      case 3:
        await noticiasPorEstado();
        break;
      case 4:
        await agruparNoticias();
        break;
      case 5:
        await cadastrarUF();
        break;
      case 6:
        await cadastrarCidade();
        break;
      case 7:
        console.log("Encerrando...");
        process.exit(0);
      default:
        console.log("Opção inválida!");
    }
  }
}