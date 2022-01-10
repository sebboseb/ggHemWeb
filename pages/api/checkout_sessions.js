import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { murloc } = req.body;
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create({
                shipping_address_collection: {
                    allowed_countries: ['SE'],
                },
                line_items: murloc,
                mode: 'payment',
                success_url: `${req.headers.origin}/succe`,
                cancel_url: `${req.headers.origin}/`,
            });
            res.json({"url":session.url});
        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}