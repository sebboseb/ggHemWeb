import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Car({ glass }) {

    const router = useRouter()
    let { id } = router.query;

    console.log(glass)
    return (
        <>
            <Head>
                <title>{glass.namn} {glass.id}</title>
            </Head>

            <main>
                <div>
                    <div className='w-full flex justify-center'>
                        <img src={glass.url} className='w-auto min-w-min max-h-96 mt-16' />
                    </div>
                    <h1>{glass.namn} {glass.supplier} {glass.antal} {glass.displayPris}</h1>
                    <p>{glass.beskrivning}</p>
                    <p>{glass.laktosfri} {glass.vegansk} {glass.sockerfri}</p>
                </div>
            </main>
        </>
    )
}

export async function getStaticProps({ params }) {

    const req = await fetch(`https://swedishicecream.herokuapp.com/glass?namn=${params.id}`);
    const data = await req.json();

    return {
        props: { glass: data[0] },
    }
}

export async function getStaticPaths() {

    const req = await fetch('https://swedishicecream.herokuapp.com/glass');
    const data = await req.json();

    const paths = data.map(glass => {
        return { params: { id: glass.namn } }
    })

    return {
        paths,
        fallback: false
    };
}