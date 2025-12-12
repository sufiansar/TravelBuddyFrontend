import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/helpers/authOptions";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // TODO: Integrate with your database update logic
    // Example: await db.travelPlan.update({ where: { id }, data })
    console.log(`Updating travel plan ${id} with:`, data);

    return NextResponse.json({
      success: true,
      message: "Travel plan updated successfully",
      data: { id, ...data },
    });
  } catch (error) {
    console.error("Error updating travel plan:", error);
    return NextResponse.json(
      { error: "Failed to update travel plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // TODO: Integrate with your database delete logic
    // Example: await db.travelPlan.delete({ where: { id } })
    console.log(`Deleting travel plan ${id}`);

    return NextResponse.json({
      success: true,
      message: "Travel plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting travel plan:", error);
    return NextResponse.json(
      { error: "Failed to delete travel plan" },
      { status: 500 }
    );
  }
}
