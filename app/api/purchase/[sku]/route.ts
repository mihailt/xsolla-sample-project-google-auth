
import { XsollaAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import XsollaApi from "@/lib/xsolla";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request, ctx: { params: { sku: string;} }) {
  try {

    const session = await getServerSession(XsollaAuthOptions);

    const user = await prisma.user.findFirst({
      where: {
        email: session!.user.email!
      }
    });

    const resp = await XsollaApi.createOrder({projectId: process.env.NEXT_PUBLIC_XSOLLA_PROJECT_ID!, apiKey: process.env.XSOLLA_MERCHANT_API_KEY!, sku: ctx.params.sku, sandbox: true, email: user!.email!, userId: user!.id!})
    const {token, order_id} = resp;

    const order = await XsollaApi.fetchOrder({projectId: process.env.NEXT_PUBLIC_XSOLLA_PROJECT_ID!, orderId: order_id!, token: token})

    const stored = await prisma.order.create({
      data: {
        order_id: order_id,
        sku: ctx.params.sku,
        status: order.status,
        amount: order.content.price.amount,
        amount_without_discount: order.content.price.amount_without_discount,
        currency: order.content.price.currency,
        userId: session?.user.id,
        mode: "sandbox"
      }
    })

    for await (const item of order.content.items) {
      await prisma.orderItem.create({
        data: {
          sku: item.sku,
          quantity: item.quantity,
          amount: item.price.amount,
          amount_without_discount: item.price.amount_without_discount,
          currency: item.price.currency,
          orderId: stored.id
        }
      })
    }
    
    return NextResponse.json({token: token}, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred." },
      { status: 500 }
    );
  }
}

