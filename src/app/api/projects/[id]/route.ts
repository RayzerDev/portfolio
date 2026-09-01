import {NextResponse} from "next/server";
import DataSingleton from "@/utils/dataUtils";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    const {searchParams} = new URL(req.url);
    const lang = (searchParams.get("lang") === "en" ? "en" : "fr") as "fr" | "en";
    const cleanId = typeof params?.id === "string" ? params.id.slice(0, 50).trim() : "";
    if (!cleanId) return NextResponse.json(null, {status: 400});

    const projects = await DataSingleton.getInstance().getProjectsData(lang);
    const project = projects.find(p => p.id === cleanId);
    if (!project) return NextResponse.json(null, {status: 404});
    return NextResponse.json(project);
}
