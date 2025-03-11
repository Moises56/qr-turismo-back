ng g module admin --routing

en agular 17 se usa  standalone: true, ya no se usa modulos

ng g component admin/dashboard --skip-tests 
ng g component admin/users --skip-tests  
ng g component admin/logs --skip-tests  

//* new components lugares-turisticos
ng g component admin/lugares-turisticos --skip-tests  
ng g component admin/tipo-local --skip-tests
ng g component admin/locales --skip-tests
ng g component admin/rutas-turisticas --skip-tests
ng g component admin/image-item --skip-tests
ng g component admin/eventos --skip-tests
ng g component admin/suscripciones --skip-tests
❯ ng g component admin/attractions --skip-tests  



//* crear interceptor
ng g interceptor core/interceptors/auth --skip-tests

//* guards
ng g guard core/guards/auth --skip-tests

//* services
ng g service core/services/auth --skip-tests


{ path: 'lugares-turisticos', title: 'Lugares Turísticos', loadComponent: () => import('./admin/lugares-turisticos/lugares-turisticos.component').then(m => m.default) },
{ path: 'tipo-local', title: 'Tipos de Local', loadComponent: () => import('./admin/tipo-local/tipo-local.component').then(m => m.default) },
{ path: 'locales', title: 'Locales', loadComponent: () => import('./admin/locales/locales.component').then(m => m.default) },
{ path: 'rutas-turisticas', title: 'Rutas Turísticas', loadComponent: () => import('./admin/rutas-turisticas/rutas-turisticas.component').then(m => m.default) },
{ path: 'image-item', title: 'Items de Imagen', loadComponent: () => import('./admin/image-item/image-item.component').then(m => m.default) },
{ path: 'eventos', title: 'Eventos', loadComponent: () => import('./admin/eventos/eventos.component').then(m => m.default) },
{ path: 'suscripciones', title: 'Suscripciones', loadComponent: () => import('./admin/suscripciones/suscripciones.component').then(m => m.default) },