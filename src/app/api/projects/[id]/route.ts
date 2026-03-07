import {NextResponse} from "next/server";
import DataSingleton from "@/utils/dataUtils";

export async function GET(req: Request, {params}: { params: { id: string } }) {
    const {searchParams} = new URL(req.url);
    const lang = (searchParams.get("lang") === "en" ? "en" : "fr") as "fr" | "en";
    const projects = await DataSingleton.getInstance().getProjectsData(lang);
    const project = projects.find(p => p.id === params.id);
    if (!project) return NextResponse.json(null, {status: 404});
    return NextResponse.json(project);
}
