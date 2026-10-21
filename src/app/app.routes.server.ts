import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // There 3 modes of rendering for Angular Universal:
  // 1. RenderMode.Prerender: So, when the application is built, the server will generate the HTML for that route and save 
  //    it as a static file. When the user requests that route, the server will serve that static file. This is good for SEO 
  //    and performance because the user gets a fully rendered page immediately.
  // 2. RenderMode.Client: The route should be generated on the client-side only. Just like a normal Angular application.
  // 3. RenderMode.Server: Don't pre-render anything but every time user gets to that path, generate that DOM on the server first.
  //    Basically at runtime, the server will generate the HTML and send it to the client. The client will then take over and make the page interactive.

  // In Angular SSR, this is for the initial request. Once you get the response backk, all of it becomes client-side rendered. So, if you navigate 
  // to another route, it will be client-side rendered.
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'event/:id',
    renderMode: RenderMode.Prerender,
    // Basically this is saying that on built time generate the HTML for event/1 and event/2. So, when the user requests event/1 or event/2, 
    // the server will serve that static file. If the user requests event/3, the server will generate the HTML for that route on the fly and 
    // send it to the client.
    async getPrerenderParams() {
      return [{ id: '1' }, { id: '2' }]
    }
  },
  {
    path: 'admin/create',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
