(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-390e9876"],{1511:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("main",{attrs:{id:"user"}},[r("div",{staticClass:"container"},[null!==e.user?r("header",{staticClass:"userProfile"},[r("figure",{staticClass:"userProfileImage"},[r("img",{attrs:{src:e.user.profile.avatar_url,alt:e.user.profile.login,width:"100"}})]),r("div",{staticClass:"userProfileInfo"},[r("div",{staticClass:"userProfileInfoHeader"},[r("p",{staticClass:"userProfileName",domProps:{innerHTML:e._s("@"+e.user.id)}}),r("p",{staticClass:"userProfileBio",domProps:{innerHTML:e._s(e.user.profile.bio)}})]),e.user.profile.email?r("p",{staticClass:"userProfileEmail"},[r("span",{staticClass:"userProfileIcon"},[r("fa",{attrs:{icon:["far","envelope"]}})],1),e._v(" "+e._s(e.user.profile.email)+" ")]):e._e(),e.user.profile.html_url?r("p",{staticClass:"userProfileGithub"},[r("a",{attrs:{href:e.user.profile.html_url,target:"_blank"}},[r("span",{staticClass:"userProfileIcon"},[r("fa",{attrs:{icon:["fab","github"]}})],1),e._v(" "+e._s(e.user.profile.html_url)+" ")])]):e._e(),e.user.profile.blog?r("p",{staticClass:"userProfileHome"},[r("a",{staticClass:"userProfileGithub",attrs:{href:e.user.profile.blog,target:"_blank"}},[r("span",{staticClass:"userProfileIcon"},[r("fa",{attrs:{icon:["fas","home"]}})],1),e._v(" "+e._s(e.user.profile.blog)+" ")])]):e._e()]),r("ul",{staticClass:"userProfileNumbers"},[r("li",[r("el-button",{attrs:{type:"default",circle:"",plain:""},domProps:{innerHTML:e._s(e.posts.length)}}),r("span",[e._v("게시물")])],1),r("li",[r("el-button",{attrs:{type:"default",circle:"",plain:""},domProps:{innerHTML:e._s(e.user.profile.followers)},on:{click:function(t){return e.windowOpen(e.user.profile.html_url+"?tab=followers")}}}),r("span",[e._v("팔로워")])],1),r("li",[r("el-button",{attrs:{type:"default",circle:"",plain:""},domProps:{innerHTML:e._s(e.user.profile.following)},on:{click:function(t){return e.windowOpen(e.user.profile.html_url+"?tab=following")}}}),r("span",[e._v("팔로잉")])],1)])]):e._e(),r("post-list",{attrs:{data:e.posts}})],1)])},a=[],i=(r("c1c3"),r("7a28")),o=r("862b"),n=r("c812"),l=r("0879"),u=r("c95d"),c=r("6dbe"),p=r("95ad"),f=r("3617"),d=r("f392"),h=r("8203"),b={PostList:f["l"]},_=Object(d["a"])("user"),m=function(e){Object(l["a"])(r,e);var t=Object(u["a"])(r);function r(){return Object(o["a"])(this,r),t.apply(this,arguments)}return Object(n["a"])(r,[{key:"onRoutePath",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.FETCH_USER(this.$route.params.userId);case 2:this.fetchPost();case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"fetchPost",value:function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.FETCH_USER_POST(this.$route.params.userId);case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"windowOpen",value:function(e){window.open(e)}},{key:"created",value:function(){this.FETCH_USER(this.$route.params.userId),this.fetchPost(),h["a"].$on("fetchPostAll",this.fetchPost)}}]),r}(p["d"]);Object(c["a"])([_.State],m.prototype,"posts",void 0),Object(c["a"])([_.State],m.prototype,"user",void 0),Object(c["a"])([_.Action],m.prototype,"FETCH_USER_POST",void 0),Object(c["a"])([_.Action],m.prototype,"FETCH_USER",void 0),Object(c["a"])([Object(p["e"])("$route.path")],m.prototype,"onRoutePath",null),m=Object(c["a"])([Object(p["a"])({components:b})],m);var P=m,v=P,w=(r("ee31"),r("a6c2")),O=Object(w["a"])(v,s,a,!1,null,"3591f1d6",null);t["default"]=O.exports},dddb:function(e,t,r){},ee31:function(e,t,r){"use strict";var s=r("dddb"),a=r.n(s);a.a}}]);
//# sourceMappingURL=chunk-390e9876.7aef389a.js.map