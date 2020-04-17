(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-33846eb9"],{9624:function(e,t,n){},dbcf:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("section",{staticClass:"settingContent"},[e._m(0),e._m(1),e.hookList.length?n("el-table",{staticClass:"table",attrs:{data:e.hookList,stripe:!0,"header-row-class-name":function(){return"tableHeader"}}},[n("el-table-column",{attrs:{label:"ID",width:"150",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("a",{attrs:{href:"#"},domProps:{innerHTML:e._s(t.row.data.id)},on:{click:function(n){return n.preventDefault(),e.pingTest(t.row)}}})]}}],null,!1,3114217887)}),n("el-table-column",{attrs:{label:"저장소",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("a",{attrs:{href:"https://github.com/"+t.row.repo,target:"_blank"}},[n("i",{staticClass:"el-icon-news"}),e._v(" "+e._s(t.row.repo)+" ")])]}}],null,!1,64938377)}),n("el-table-column",{attrs:{label:"등록일",width:"200",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(e._f("dateformat")(t.row.data.created_at))+" ")]}}],null,!1,1775742599)}),n("el-table-column",{attrs:{label:"삭제",width:"150",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-popconfirm",{attrs:{title:"삭제하시겠습니까?","confirm-button-text":"확인","cancel-button-text":"취소"},on:{onConfirm:function(n){return e.remove(t.row.idx)}}},[n("el-button",{attrs:{slot:"reference",type:"danger",icon:"el-icon-delete",size:"mini",plain:"",circle:""},slot:"reference"})],1)]}}],null,!1,759287506)})],1):e._e(),0===e.hookList.length?n("p",{staticClass:"none"},[e._v(" 등록된 자동 반영 저장소가 없습니다. ")]):e._e(),n("div",{staticClass:"btnGroup right"},[n("el-button",{attrs:{type:"primary",size:"small",icon:"el-icon-circle-plus-outline",plain:""},on:{click:function(){return e.repositories.open()}}},[e._v("저장소 등록")])],1),n("github-repository-list",{ref:"repositories",on:{select:e.add}})],1)},s=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("h2",{staticClass:"settingContentTitle"},[n("i",{staticClass:"el-icon-document-copy"}),n("span",[e._v("자동 반영 저장소 관리")])])},function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ul",{staticClass:"description"},[n("li",[e._v("Github Hook을 이용하여 commit 발생 시 "),n("strong",[e._v("등록된 포스트와 동기화")]),e._v("합니다.")]),n("li",[e._v("포스트로 등록한 파일의 위치나 이름이 달라질 경우, "),n("strong",[e._v("수동으로 동기화")]),e._v("를 해야합니다.")]),n("li",[e._v("저장소의 ID를 클릭하면 "),n("strong",[e._v("Ping Test")]),e._v("를 할 수 있습니다.")])])}],a=(n("c1c3"),n("7a28")),o=n("862b"),i=n("c812"),c=n("0879"),u=n("c95d"),l=n("6dbe"),p=n("95ad"),f=n("f392"),h=n("08ba"),b=n("3617"),m={GithubRepositoryList:b["g"]},d=Object(f["a"])("user"),_=Object(f["a"])("github"),v=function(e){Object(c["a"])(n,e);var t=Object(u["a"])(n);function n(){return Object(o["a"])(this,n),t.apply(this,arguments)}return Object(i["a"])(n,[{key:"pingTest",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){var n,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(n=t.repo,r=t.data.id,null!==this.access_token){e.next=4;break}return this.$message({type:"error",message:"다시 로그인 해주세요"}),e.abrupt("return");case 4:return e.prev=4,e.next=7,h["b"].hookPingTest(n,r,this.access_token);case 7:this.$message({type:"success",message:"핑 테스트를 성공했습니다."}),e.next=13;break;case 10:e.prev=10,e.t0=e["catch"](4),this.$message({type:"error",message:"핑 테스트 도중 오류가 발생했습니다."});case 13:case"end":return e.stop()}}),e,this,[[4,10]])})));function t(t){return e.apply(this,arguments)}return t}()},{key:"remove",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.DELETE_GITHUB_HOOK(t);case 2:this.$message({type:"success",message:"삭제되었습니다."});case 3:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}()},{key:"add",value:function(e){var t=this,n="정말로 추가하시겠습니까?",r="Hook 추가",s="확인",o="취소",i="warning";this.$confirm(n,r,{type:i,confirmButtonText:s,cancelButtonText:o}).then(Object(a["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,t.ADD_GITHUB_HOOK(e.full_name);case 2:t.$message({type:"success",message:"추가 되었습니다."}),t.repositories.close();case 4:case"end":return n.stop()}}),n)})))).catch((function(){t.$message({type:"info",message:"취소되었습니다."})}))}},{key:"created",value:function(){var e=Object(a["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.FETCH_GITHUB_HOOK();case 2:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"repositories",get:function(){return this.$refs.repositories}}]),n}(p["d"]);Object(l["a"])([d.State],v.prototype,"access_token",void 0),Object(l["a"])([_.State],v.prototype,"hookList",void 0),Object(l["a"])([_.Action],v.prototype,"FETCH_GITHUB_HOOK",void 0),Object(l["a"])([_.Action],v.prototype,"DELETE_GITHUB_HOOK",void 0),Object(l["a"])([_.Action],v.prototype,"ADD_GITHUB_HOOK",void 0),v=Object(l["a"])([Object(p["a"])({components:m})],v);var g=v,k=g,y=(n("f015"),n("a6c2")),w=Object(y["a"])(k,r,s,!1,null,"6be5caa5",null);t["default"]=w.exports},f015:function(e,t,n){"use strict";var r=n("9624"),s=n.n(r);s.a}}]);
//# sourceMappingURL=chunk-33846eb9.fd891b36.js.map