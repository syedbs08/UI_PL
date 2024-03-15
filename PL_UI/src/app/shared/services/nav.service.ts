import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ApiconstantService } from '../helpers/apiconstant.service';
import { HttpModuleService } from '../helpers/http-client-service';

//Menu Bar
export interface Menu {
    headTitle?: string,
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    badgeClass?: string;
    active?: boolean;
    children?: Menu[];
    order?: number
}

@Injectable({
    providedIn: 'root'
})

export class NavService implements OnDestroy {

    private unsubscriber: Subject<any> = new Subject();
    public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

    public megaMenu: boolean = false;
    public megaMenuCollapse: boolean = window.innerWidth < 1199 ? true : false;
    public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;
    public fullScreen: boolean = false;
    public items: BehaviorSubject<Menu[]> = new BehaviorSubject<Menu[]>(
        []
    );
    constructor(
        private router: Router,
        private httpHelper: HttpModuleService,
        private apiUrl: ApiconstantService
    ) {
        this.setScreenWidth(window.innerWidth);
        fromEvent(window, 'resize').pipe(
            debounceTime(1000),
            takeUntil(this.unsubscriber)
        ).subscribe((evt: any) => {
            this.setScreenWidth(evt.target.innerWidth);
            if (evt.target.innerWidth < 991) {
                this.collapseSidebar = false;
                this.megaMenu = false;
            }
            if (evt.target.innerWidth < 1199) {
                this.megaMenuCollapse = true;
            }
        });
        if (window.innerWidth < 991) {
            this.router.events.subscribe(event => {
                this.collapseSidebar = false;
                this.megaMenu = false;
            });
        }
        this.loadMenu();
    }
    getData(): Observable<Menu[]> {

        return this.items;
  }
  //FCPLCOmpany
  getFCPLCompany() {
    return this.httpHelper.apiGet(this.apiUrl.urlMaster + "get-FCPLCompany", null)
  }
    loadMenu() {
        //var storageMenu = JSON.parse(localStorage.getItem('userMenu')!);
        // if (storageMenu != null) {
        //     this.items.next(storageMenu);
        // }
        // else {

            this.httpHelper.apiGet(this.apiUrl.urlAuth + "menus", null).subscribe(resp => {
               // localStorage.setItem('userMenu', JSON.stringify(resp))
                this.items.next(resp);
            });
      //  }
    }
    ngOnDestroy() {
        this.unsubscriber.next(true);
        this.unsubscriber.complete();
    }

    private setScreenWidth(width: number): void {
        this.screenWidth.next(width);
    }


    MENUITEMS: Menu[] = [
        { headTitle: 'MAIN' },
        {
            path: '/dashboard', title: 'Dashboard', type: 'link', icon: 'home', badgeType: 'danger', badgeValue: 'Hot',
             active: false
        },


        {
            title: 'Master', icon: 'database', type: 'sub', active: false,
            children: [
                { path: '/components/country', title: 'Country', type: 'link' },
                { path: '/components/default-calendar', title: 'Default Calendar', type: 'link' },
                { path: '/components/counters', title: 'Counters', type: 'link' },
                { path: '/components/notifications', title: 'Notifications', type: 'link' },
                { path: '/components/sweet-alerts', title: 'Sweet Alerts', type: 'link' },
                { path: '/components/cards-design', title: 'Cards Design', type: 'link' },
                { path: '/components/default-chat', title: 'Default Chat', type: 'link' },
                { path: '/components/range-slider', title: 'Range slider', type: 'link' },
                { path: '/components/content-scrollbar', title: 'Content Scrollbar', type: 'link' },
                { path: '/components/loaders', title: 'Loaders', type: 'link' },
                { path: '/components/rating', title: 'Rating', type: 'link' },
                { path: '/components/timeline', title: 'Time Line', type: 'link' },
                { path: '/components/treeview', title: 'Treeview', type: 'link' },
            ]
        },

        {
            title: 'Elements', icon: 'package', type: 'sub', active: false,
            children: [
                { path: '/elements/alerts', title: 'Alerts', type: 'link' },
                { path: '/elements/avatar-square', title: 'Avatars Square', type: 'link' },
                { path: '/elements/avatar-rounded', title: 'Avatars Rounded', type: 'link' },
                { path: '/elements/avatar-radius', title: 'Avatars Radius', type: 'link' },
                { path: '/elements/badges', title: 'Badges', type: 'link' },
                { path: '/elements/breadcrumbs', title: 'Breadcrumb', type: 'link' },
                { path: '/elements/buttons', title: 'Buttons', type: 'link' },
                { path: '/elements/colors', title: 'Colors', type: 'link' },
                { path: '/elements/dropdowns', title: 'Dropdowns', type: 'link' },
                { path: '/elements/pagination', title: 'Pagination', type: 'link' },
                { path: '/elements/navigation', title: 'Navigation', type: 'link' },
                { path: '/elements/typography', title: 'Typography', type: 'link' },
                { path: '/elements/panels', title: 'Panel', type: 'link' },
                { path: '/elements/list', title: 'List', type: 'link' },
                { path: '/elements/tags', title: 'Tags', type: 'link' },
                { path: '/elements/thumbnails', title: 'Thumbnails', type: 'link' },

            ]
        },

        {
            title: 'Advanced Elements', icon: 'file', type: 'sub', active: false,
            children: [
                { path: '/advanced-elements/accordion', title: 'Accordion', type: 'link' },
                { path: '/advanced-elements/carousel', title: 'Carousel', type: 'link' },
                { path: '/advanced-elements/media-object', title: 'Media Object', type: 'link' },
                { path: '/advanced-elements/tabs', title: 'Tabs', type: 'link' },
                { path: '/advanced-elements/modal', title: 'Modal', type: 'link' },
                { path: '/advanced-elements/tooltip-popover', title: 'Tooltip and Popover', type: 'link' },
                { path: '/advanced-elements/progress', title: 'Progress', type: 'link' },
                { path: '/advanced-elements/user-list', title: 'User List', type: 'link' },
                { path: '/advanced-elements/headers', title: 'Headers', type: 'link' },
                { path: '/advanced-elements/footers', title: 'Footers', type: 'link' },
                { path: '/advanced-elements/search', title: 'Search', type: 'link' },
                { path: '/advanced-elements/crypto-currencies', title: 'Crypto Currencies', type: 'link' },

            ]
        },

        { headTitle: 'CHARTS & TABLES' },
        {
            title: 'Charts', icon: 'pie-chart', type: 'sub', badgeType: 'success', badgeValue: '6', active: false,
            children: [
                { path: '/charts/apex-charts', title: 'Apex Charts', type: 'link' },
                { path: '/charts/chartjs', title: 'ChartJS', type: 'link' },
                { path: '/charts/chartist', title: 'Chartist', type: 'link' },
                { path: '/charts/echarts', title: 'ECharts', type: 'link' },

            ]
        },

        {
            title: 'Tables', icon: 'clipboard', badgeValue: '3', badgeClass: 'secondary', type: 'sub', active: false,
            children: [
                { path: '/tables/default-tables', title: 'Default Table', type: 'link' },
                { path: '/tables/data-tables', title: 'Data Table', type: 'link' }
            ]
        },
        { headTitle: 'PAGES' },
        {
            title: 'Pages', icon: 'layers', type: 'sub', active: false,
            children: [
                { path: '/pages/profile', title: 'Profile', type: 'link' },
                { path: '/pages/edit-profile', title: 'Edit Profile', type: 'link' },
                { path: '/pages/about-company', title: 'About Company', type: 'link' },
                { path: '/pages/mail-inbox', title: 'Mail Inbox', type: 'link' },
                { path: '/pages/mail-compose', title: 'Mail Compose', type: 'link' },
                { path: '/pages/gallery', title: 'Gallery', type: 'link' },
                { path: '/pages/services', title: 'Services', type: 'link' },
                { path: '/pages/invoice', title: 'Invoice', type: 'link' },
                { path: '/pages/terms', title: 'Terms', type: 'link' },
                { path: '/pages/pricing-tables', title: 'Pricing Tables', type: 'link' },
                { path: '/pages/faqs', title: 'Faqs', type: 'link' },
                { path: '/pages/empty-page', title: 'Empty Page', type: 'link' },
                { path: '/custom-pages/under-construction', title: 'Under Construction', type: 'link' },

                {
                    title: 'Blog', type: 'sub', active: false, children: [
                        { path: '/pages/blog/blog', title: 'Blog', type: 'link' },
                        { path: '/pages/blog/blog-details', title: 'Blog Details', type: 'link' },
                        { path: '/pages/blog/blog-post', title: 'Blog Post', type: 'link' },
                    ]
                },

                {
                    path: '/maps', title: 'Maps', type: 'link', icon: 'globe', badgeType: 'danger', badgeValue: '3', active: false
                },

                {
                    title: 'E-Commerce', icon: 'shopping-cart', type: 'sub', badgeType: 'danger', badgeValue: '3', active: false,
                    children: [
                        { path: '/pages/ecommerce/products', title: 'Products', type: 'link' },
                        { path: '/pages/ecommerce/product-details', title: 'Product Details', type: 'link' },
                        { path: '/pages/ecommerce/shopping-cart', title: 'Shopping Cart', type: 'link' },
                        { path: '/pages/ecommerce/wishlist', title: 'Wishlist', type: 'link' },
                        { path: '/pages/ecommerce/checkout', title: 'Checkout', type: 'link' },
                    ]
                },
                {
                    title: 'File manager', type: 'sub', active: false,
                    children: [
                        { path: '/pages/files/file-manager', title: 'File Manager', type: 'link' },
                        { path: '/pages/files/file-manager-list', title: 'File Manager List', type: 'link' },
                        { path: '/pages/files/file-details', title: 'File Details', type: 'link' },
                        { path: '/pages/files/file-attachments', title: 'File Attachments', type: 'link' }
                    ]
                },
            ]
        },

        { headTitle: 'CUSTOM & ERROR PAGES' },
        {
            title: 'Custome Pages', icon: 'settings', type: 'sub', active: false,
            children: [
                { path: '/custom-pages/login', title: 'Login', type: 'link' },
                { path: '/custom-pages/register', title: 'Register', type: 'link' },
                { path: '/custom-pages/forget-password', title: 'Forget Password', type: 'link' },
                { path: '/custom-pages/lock-screen', title: 'Lock Screen', type: 'link' },
                {
                    title: 'Error Pages', icon: 'info', type: 'sub', active: false,
                    children: [
                        { path: '/error/error400', title: '400', type: 'link' },
                        { path: '/error/error401', title: '401', type: 'link' },
                        { path: '/error/error403', title: '403', type: 'link' },
                        { path: '/error/error404', title: '404', type: 'link' },
                        { path: '/error/error500', title: '500', type: 'link' },
                        { path: '/error/error503', title: '503', type: 'link' },
                    ]
                }
            ]
        },

        { headTitle: 'FORMS & ICONS' },
        {
            title: 'Forms', icon: 'file-text', type: 'sub', active: false, badgeClass: 'warning', badgeValue: '5',
            children: [
                { path: 'forms/form-elements', title: 'Form Element', type: 'link' },
                { path: 'forms/form-advanced', title: 'Advanced Form', type: 'link' },
                { path: 'forms/form-validation', title: 'Form Validation', type: 'link' },
                { path: 'forms/form-wizards', title: 'Form Wizards', type: 'link' },
                { path: 'forms/form-editor', title: 'Form Editor', type: 'link' },
            ]
        },

        {
            title: 'Icons', icon: 'command', type: 'sub', badgeType: 'warning', badgeValue: '11', active: false,
            children: [
                { path: '/icons/font-awesome', title: 'Font Awesome Icons', type: 'link' },
                { path: '/icons/material-design', title: 'Material Design Icons', type: 'link' },
                { path: '/icons/simple-line', title: 'Simple Line Icons', type: 'link' },
                { path: '/icons/feather-icons', title: 'Feather Icons', type: 'link' },
                { path: '/icons/ionic-icons', title: 'Ionic Icons', type: 'link' },
                { path: '/icons/flag-icons', title: 'Flag Icons', type: 'link' },
                { path: '/icons/pe7-icons', title: 'pe7 Icons', type: 'link' },
                { path: '/icons/themify-icons', title: 'Themify Icons', type: 'link' },
                { path: '/icons/typicons', title: 'Typicons Icons', type: 'link' },
            ]
        },


    ];
   
    //items: BehaviorSubject<Menu[]>;
    //array
    //    items = new BehaviorSubject<Menu[]>(
    //     this.MENUITEMS
    // //     [{"title":"Home","icon":"fa fa-home","path":"","type":"sub","order":0,"children":[]},
    // //     {"title":"Masters","icon":"feather icon-user","path":"","type":"sub","order":0,
    // //     "children":[{"title":"Company","icon":"","path":"/master/company","type":"link","order":0,"children":[]},
    // //     {"title":"Account","icon":"null","path":"/master/account","type":"link","order":0,"children":[]},
    // //     {"title":"Department","icon":"null","path":"/master/department","type":"link","order":0,"children":[]},
    // //     {"title":"Customer","icon":"null","path":"/master/account","type":"link","order":0,"children":[]
    // //  }]}]

    //    );


}
