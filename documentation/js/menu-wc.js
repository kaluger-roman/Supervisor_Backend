'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">supervisor documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AgentModule.html" data-type="entity-link" >AgentModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AgentModule-6e715e7205b137131cc7d6d4733e2f2f1ee1f1b83ebe6ad516e5fea5dccae52ed43c2c814f8facb51b1cca9e9609907b9da6b613cec8ab1c0936000d3efd04b9"' : 'data-target="#xs-controllers-links-module-AgentModule-6e715e7205b137131cc7d6d4733e2f2f1ee1f1b83ebe6ad516e5fea5dccae52ed43c2c814f8facb51b1cca9e9609907b9da6b613cec8ab1c0936000d3efd04b9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AgentModule-6e715e7205b137131cc7d6d4733e2f2f1ee1f1b83ebe6ad516e5fea5dccae52ed43c2c814f8facb51b1cca9e9609907b9da6b613cec8ab1c0936000d3efd04b9"' :
                                            'id="xs-controllers-links-module-AgentModule-6e715e7205b137131cc7d6d4733e2f2f1ee1f1b83ebe6ad516e5fea5dccae52ed43c2c814f8facb51b1cca9e9609907b9da6b613cec8ab1c0936000d3efd04b9"' }>
                                            <li class="link">
                                                <a href="controllers/AgentController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AgentController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' : 'data-target="#xs-controllers-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' :
                                            'id="xs-controllers-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' : 'data-target="#xs-injectables-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' :
                                        'id="xs-injectables-links-module-AppModule-9dfb1160e8d906ec06931bb026fc320d0b857c7aae485a2a429f6bb53ba32f00bb545d865852ef33294a7d6d262d4bc5b45fea64a2824b7cddbfcb149c35bea8"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' : 'data-target="#xs-controllers-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' :
                                            'id="xs-controllers-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' : 'data-target="#xs-injectables-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' :
                                        'id="xs-injectables-links-module-AuthModule-3b092a6a4e98af0fbb8ac5e7ef3679e9ed6be68c235c413373fc19a29c7dec0e7e1e2668b0282de2794553c376438a943d02433d7d0cba9d9229cd371f4f3104"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CallsModule.html" data-type="entity-link" >CallsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CallsModule-cc90ea168dcb0f56790fe7f3fa10b4e050292c2c5af798e90abb8bfbc465ad1039989720670fedc9cf11cc8dc10fd8ba97b8388160e8c77b3d3beb6a59cc2ca3"' : 'data-target="#xs-injectables-links-module-CallsModule-cc90ea168dcb0f56790fe7f3fa10b4e050292c2c5af798e90abb8bfbc465ad1039989720670fedc9cf11cc8dc10fd8ba97b8388160e8c77b3d3beb6a59cc2ca3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CallsModule-cc90ea168dcb0f56790fe7f3fa10b4e050292c2c5af798e90abb8bfbc465ad1039989720670fedc9cf11cc8dc10fd8ba97b8388160e8c77b3d3beb6a59cc2ca3"' :
                                        'id="xs-injectables-links-module-CallsModule-cc90ea168dcb0f56790fe7f3fa10b4e050292c2c5af798e90abb8bfbc465ad1039989720670fedc9cf11cc8dc10fd8ba97b8388160e8c77b3d3beb6a59cc2ca3"' }>
                                        <li class="link">
                                            <a href="injectables/CallsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CallsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CaslModule.html" data-type="entity-link" >CaslModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CaslModule-f287f9727dcfd7b232367ef259084a789e8074a71b549b4e77d789c2e59c3d1eda261ca86311fc0f6e9a9b1a555d832760982101d12fa73f96c876bb433ee819"' : 'data-target="#xs-injectables-links-module-CaslModule-f287f9727dcfd7b232367ef259084a789e8074a71b549b4e77d789c2e59c3d1eda261ca86311fc0f6e9a9b1a555d832760982101d12fa73f96c876bb433ee819"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CaslModule-f287f9727dcfd7b232367ef259084a789e8074a71b549b4e77d789c2e59c3d1eda261ca86311fc0f6e9a9b1a555d832760982101d12fa73f96c876bb433ee819"' :
                                        'id="xs-injectables-links-module-CaslModule-f287f9727dcfd7b232367ef259084a789e8074a71b549b4e77d789c2e59c3d1eda261ca86311fc0f6e9a9b1a555d832760982101d12fa73f96c876bb433ee819"' }>
                                        <li class="link">
                                            <a href="injectables/CaslAbilityFactory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CaslAbilityFactory</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EventsModule.html" data-type="entity-link" >EventsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InitModule.html" data-type="entity-link" >InitModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InitModule-38dcefc8b4a2c7f212bd30f91cc886695eabc918c8219bb1b4cd918c9d3e3b2ece4a820a2adc45b13a15cfe92bab2ea65db4aa6d353395655b56bd7d21a3c45c"' : 'data-target="#xs-injectables-links-module-InitModule-38dcefc8b4a2c7f212bd30f91cc886695eabc918c8219bb1b4cd918c9d3e3b2ece4a820a2adc45b13a15cfe92bab2ea65db4aa6d353395655b56bd7d21a3c45c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InitModule-38dcefc8b4a2c7f212bd30f91cc886695eabc918c8219bb1b4cd918c9d3e3b2ece4a820a2adc45b13a15cfe92bab2ea65db4aa6d353395655b56bd7d21a3c45c"' :
                                        'id="xs-injectables-links-module-InitModule-38dcefc8b4a2c7f212bd30f91cc886695eabc918c8219bb1b4cd918c9d3e3b2ece4a820a2adc45b13a15cfe92bab2ea65db4aa6d353395655b56bd7d21a3c45c"' }>
                                        <li class="link">
                                            <a href="injectables/InitService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InitService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecordsModule.html" data-type="entity-link" >RecordsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' : 'data-target="#xs-controllers-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' :
                                            'id="xs-controllers-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' }>
                                            <li class="link">
                                                <a href="controllers/RecordsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecordsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' : 'data-target="#xs-injectables-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' :
                                        'id="xs-injectables-links-module-RecordsModule-9f5d8200219bd8ae65e11687577679cf482fcbcd33e1093988fa34fc6dce56be3385bb7349624cc789a13245b119d8b9412a91ca8106980eb4e9f518926aa09e"' }>
                                        <li class="link">
                                            <a href="injectables/RecordsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecordsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SRModule.html" data-type="entity-link" >SRModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SRModule-debb9040761999ad5c10a84c03901d8d9ff51c629b1f5d5d7e9123e82b3a9f185633469fd3124aba7ddc003cbd43a63f327f24c20de01c6dcddc204da3fcdce2"' : 'data-target="#xs-injectables-links-module-SRModule-debb9040761999ad5c10a84c03901d8d9ff51c629b1f5d5d7e9123e82b3a9f185633469fd3124aba7ddc003cbd43a63f327f24c20de01c6dcddc204da3fcdce2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SRModule-debb9040761999ad5c10a84c03901d8d9ff51c629b1f5d5d7e9123e82b3a9f185633469fd3124aba7ddc003cbd43a63f327f24c20de01c6dcddc204da3fcdce2"' :
                                        'id="xs-injectables-links-module-SRModule-debb9040761999ad5c10a84c03901d8d9ff51c629b1f5d5d7e9123e82b3a9f185633469fd3124aba7ddc003cbd43a63f327f24c20de01c6dcddc204da3fcdce2"' }>
                                        <li class="link">
                                            <a href="injectables/SRService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SRService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' : 'data-target="#xs-controllers-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' :
                                            'id="xs-controllers-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' : 'data-target="#xs-injectables-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' :
                                        'id="xs-injectables-links-module-UsersModule-8b6a2f7d78ae087370d2398fbd0f5cd54752f63c293b82d570f527982a817770ff0d23800e55c81506e30cfd766d94dfc64eb847a331f7177651232264ad8614"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WebRTCModule.html" data-type="entity-link" >WebRTCModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-WebRTCModule-22c1533b618433bc87e6fa62a95f8cefeb0cac60c51a49c9fc99a9a9368e8a6556f1e8076991f9ce4703aa4b15736cd3c1d50130a90386fd80e0def2a187ca89"' : 'data-target="#xs-injectables-links-module-WebRTCModule-22c1533b618433bc87e6fa62a95f8cefeb0cac60c51a49c9fc99a9a9368e8a6556f1e8076991f9ce4703aa4b15736cd3c1d50130a90386fd80e0def2a187ca89"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WebRTCModule-22c1533b618433bc87e6fa62a95f8cefeb0cac60c51a49c9fc99a9a9368e8a6556f1e8076991f9ce4703aa4b15736cd3c1d50130a90386fd80e0def2a187ca89"' :
                                        'id="xs-injectables-links-module-WebRTCModule-22c1533b618433bc87e6fa62a95f8cefeb0cac60c51a49c9fc99a9a9368e8a6556f1e8076991f9ce4703aa4b15736cd3c1d50130a90386fd80e0def2a187ca89"' }>
                                        <li class="link">
                                            <a href="injectables/WebRTCService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WebRTCService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Call.html" data-type="entity-link" >Call</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventsGateway.html" data-type="entity-link" >EventsGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/Record.html" data-type="entity-link" >Record</a>
                            </li>
                            <li class="link">
                                <a href="classes/Secret.html" data-type="entity-link" >Secret</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transcription.html" data-type="entity-link" >Transcription</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/User-1.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkersPool.html" data-type="entity-link" >WorkersPool</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/PoliciesGuard.html" data-type="entity-link" >PoliciesGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/WsJwtGuard.html" data-type="entity-link" >WsJwtGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IPolicyHandler.html" data-type="entity-link" >IPolicyHandler</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});