import NextAuth from "next-auth"
import { authConfig } from "./auth.config"


const { auth } = NextAuth(authConfig)

export default auth;

/*
 *なんかあれらしいね。netlifyのedge環境だとC++のライブラリが存在するとエラー吐くっぽい。
 prismaがそれに当たるらしいからEdge用のauth関数を用意する
 */
