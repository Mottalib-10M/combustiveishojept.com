/** Les 5 postes les moins chers par concelho et combustível d'un district, chargés quand le visiteur change de district. */
import type { APIRoute } from 'astro';
import { DISTRITOS, slug } from '../../lib/dados';
import { postosDistrito } from '../../lib/bundle';
export function getStaticPaths() { return DISTRITOS.map((d) => ({ params: { d: slug(d) }, props: { d } })); }
export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(postosDistrito(props.d as string)), { headers: { 'Content-Type': 'application/json' } });
