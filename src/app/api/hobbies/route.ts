import {NextResponse} from "next/server";
import DataSingleton from "@/utils/dataUtils";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);
    const lang = (searchParams.get("lang") === "en" ? "en" : "fr") as "fr" | "en";
    const data = await DataSingleton.getInstance().getHobbiesData(lang);
    return NextResponse.json(data);
}
