(function(n,l){typeof exports=="object"&&typeof module!="undefined"?l(exports,require("nanoid")):typeof define=="function"&&define.amd?define(["exports","nanoid"],l):(n=typeof globalThis!="undefined"?globalThis:n||self,l(n["vue-validate-form"]={},n.nanoid))})(this,function(n,l){"use strict";const S={};function O(e,t){S[e]=t}const f=Symbol("hasFieldValue"),u=Symbol("getFieldValue"),c=Symbol("getFieldDefaultValue"),V=Symbol("getErrors"),d=Symbol("register"),F=Symbol("validate"),m=Symbol("getIsSubmitted");var N=Object.freeze(Object.defineProperty({__proto__:null,hasFieldValue:f,getFieldValue:u,getFieldDefaultValue:c,getErrors:V,register:d,validate:F,getIsSubmitted:m},Symbol.toStringTag,{value:"Module"}));function p(e,t=null){return e.$scopedSlots.default?e.$scopedSlots.default(t)||[]:e.$slots.default||[]}function b(e,t){if(!v(e))return!1;let i=t.split(".");for(;i.length;){const s=i.shift();if(!(s in e))return!1;e=e[s]}return!0}function g(e,t,i){if(!v(e))return i;let s=t.split(".");for(;s.length&&e;){const r=s.shift();e=e[r]}return s.length?i:e}function D(e,t,i){if(!v(e))return;let s=t.split(".");for(;s.length>1;){const r=s.shift();v(e[r])||(e[r]=$(s[0])?[]:{}),e=e[r]}e[s[0]]=i}function $(e){const t=Number(e);return!Number.isNaN(t)}function v(e){return!!e&&typeof e=="object"}const h="onFieldChange",C="onFormChange";var I={name:"ValidationProvider",provide(){return{[d]:this.register,[F]:async e=>{const{errors:t}=await this.validate(e);this.setErrorsList(t)},[c]:this.getFieldDefaultValue,[u]:e=>g(this.values,e),[V]:this.getErrors,[f]:e=>b(this.values,e),[m]:()=>this.submitted}},props:{defaultValues:{type:Object,default:()=>({})},defaultErrors:{type:Object,default:()=>({})},resolver:{type:Function,default:null},tag:{type:String,default:"div"}},data(){return{submitted:!1,innerDefaultValues:{},fieldComponents:[],additionalErrors:{}}},computed:{fieldComponentMap(){return this.fieldComponents.reduce((e,t)=>(e[t.name]=t,e),{})},values(){return this.fieldComponents.reduce((e,{name:t,getValue:i})=>(D(e,t,i()),e),{})},dirty(){return this.fieldComponents.some(({dirty:e})=>e)},pristine(){return!this.fieldComponents.some(({pristine:e})=>!e)},errors(){return this.fieldComponents.reduce((e,{name:t,errors:i})=>(e[t]=i,e),Object.assign({},this.additionalErrors))},existsErrors(){return Object.values(this.errors).some(e=>e.length)},firstInvalidFieldComponent(){return this.fieldComponents.find(({name:e})=>this.errors[e].length)}},watch:{defaultValues:{immediate:!0,handler:"setDefaultData"},defaultErrors:"setDefaultData",dirty:{immediate:!0,handler(e){this.$emit("dirty",e)}}},methods:{async setDefaultData(){if(this.reset(this.defaultValues),!Object.values(this.defaultErrors).some(t=>t.length))return;this.setErrorsList(this.defaultErrors,h);const{errors:e}=await this.validate();this.setErrorsList(e),this.$nextTick(()=>{this.submitted=!0})},getFieldDefaultValue(e,t){return g(this.innerDefaultValues,e,t)},getErrors(e){return e?this.errors[e]||[]:this.errors},async onSubmit(){this.submitted=!0,this.additionalErrors={};const{values:e,errors:t}=await this.validate();if(this.setErrorsList(t),this.existsErrors)return this.focusInvalidField();this.$emit("submit",e,{setError:this.setError,reset:this.reset,onFieldChange:this.onFieldChange,focusInvalidField:this.focusInvalidField})},async validate(e=null){const{values:t,errors:i}=await this.resolveSchema(),s=this.getLegacyValidateErrors(i);return this.fieldComponents.forEach(({resetErrors:r,errors:o,name:a})=>{if(e!==a){const E=o.filter(({resetBehaviour:y})=>y!==C);s[a]=E.concat(s[a]||[])}r()}),{values:t,errors:s}},resolveSchema(){const e=this.values;return this.resolver?this.resolver(e):{values:e,errors:{}}},getLegacyValidateErrors(e={}){return this.fieldComponents.reduce((t,{name:i,rules:s,getValue:r})=>(t[i]=Object.entries(s).reduce((o,[a,E])=>{const y=S[a];if(!y)throw new Error(`validator '${a}' must be registered`);return y(r(),E.params)||o.push({message:E.message,type:a}),o},t[i]||[]),t),e)},onFieldChange(e,t){this.fieldComponentMap[e].onChange(t)},reset(e){this.submitted=!1,e&&(this.innerDefaultValues=JSON.parse(JSON.stringify(e))),this.fieldComponents.forEach(({reset:t})=>{t()})},setErrorsList(e,t=C){Object.entries(e).forEach(([i,s])=>{s.forEach(({message:r,type:o,resetBehaviour:a=t})=>{this.setErrorActual(i,{message:r,type:o,resetBehaviour:a})})})},setError(e,t,i=null,s=h){this.setErrorActual(e,{message:t,type:i,resetBehaviour:s})},setErrorActual(e,{message:t,type:i=null,resetBehaviour:s=h}){const r=this.fieldComponentMap[e];if(r){r.setErrorActual({message:t,type:i,resetBehaviour:s});return}this.additionalErrors[e]===void 0&&this.$set(this.additionalErrors,e,[]),this.additionalErrors[e].push({type:i,message:t,resetBehaviour:s})},focusInvalidField(){return this.firstInvalidFieldComponent&&this.firstInvalidFieldComponent.onFocus()},register(e){const t=e.name;return this.fieldComponents.push(e),(this.additionalErrors[t]||[]).forEach(i=>{this.setErrorActual(t,i)}),this.$delete(this.additionalErrors,t),()=>this.unregister(e)},unregister(e){this.fieldComponents=this.fieldComponents.filter(t=>t!==e)}},render(e){const t=p(this,{handleSubmit:this.onSubmit,onFieldChange:this.onFieldChange,reset:this.reset,setError:this.setError,focusInvalidField:this.focusInvalidField,values:this.values,dirty:this.dirty,pristine:this.pristine,invalid:this.submitted&&this.existsErrors,errors:this.errors});return t.length<=1?t[0]:e(this.tag,t)}},w={name:"ValidationField",inject:{hasFieldValue:f,getFieldDefaultValue:c,getFieldValue:u,getIsSubmitted:m,register:d,validate:F},data(){return{value:void 0,pristine:!0,errors:[]}},props:{name:{type:String,required:!0},rules:{type:Object,default:()=>({})},isEqual:{type:Function,default:(e,t)=>e===t},tag:{type:String,default:"div"}},computed:{defaultValue(){return this.getFieldDefaultValue(this.name)},hasProvidedValue(){return this.hasFieldValue(this.name)},providedValue(){return this.getFieldValue(this.name)},submitted(){return this.getIsSubmitted()},dirty(){return!this.isEqual(this.value,this.defaultValue)},firstError(){return this.errors[0]},invalid(){return this.submitted&&!!this.errors.length}},mounted(){this.value=this.hasProvidedValue?this.providedValue:this.defaultValue,this.unregister=this.register(this)},beforeDestroy(){this.unregister()},methods:{getValue(){return this.value},onFocus(){this.$emit("should-focus",{name:this.name})},reset(){this.resetErrors(),this.$nextTick(()=>{this.onChange(this.defaultValue),this.pristine=!0})},onChange(e){this.isEqual(this.value,e)||(this.value=e,this.pristine=!1,this.$emit("change",e),this.submitted&&this.validate(this.name))},setError(e,t=null,i=h){this.setErrorActual({message:e,type:t,resetBehaviour:i})},setErrorActual({message:e,type:t=null,resetBehaviour:i=h}){this.errors.push({type:t,message:e,resetBehaviour:i})},resetErrors(){this.errors.length&&(this.errors=[])}},render(e){const t=p(this,{name:this.name,onChange:this.onChange,setError:this.setError,modelValue:this.value,errors:this.errors,firstError:this.firstError,dirty:this.dirty,invalid:this.invalid,pristine:this.pristine});return t.length<=1?t[0]:e(this.tag,t)}},A={name:"ValidationFieldArray",inject:{register:d,getFieldDefaultValue:c,getFieldValue:u},provide(){return{[f]:e=>{const t=e.replace(new RegExp(`^${this.name}.`),"");return b(this.actualValue,t)||b(this.fields,t)},[u]:e=>{const t=e.replace(new RegExp(`^${this.name}.`),"");return g(this.actualValue,t)||g(this.fields,t)},[d]:e=>{if(this.focusOptions){const{focusName:t}=this.focusOptions,{onFocus:i,name:s}=e;s===t&&(i(),this.focusOptions=null)}return this.register(e)}}},data(){return{fields:[],focusOptions:null,errors:[],rules:[],dirty:!1,pristine:!0}},props:{name:{type:String,required:!0},keyName:{type:String,default:"id"},tag:{type:String,default:"div"}},computed:{defaultValue(){return this.getFieldDefaultValue(this.name)||[]},actualValue(){const e=this.keyName,t=this.getFieldValue(this.name)||[];return this.fields.map((i,s)=>({...t[s],[e]:i[e]}))}},mounted(){this.fields=[...this.defaultValue],this.unregister=this.register(this)},beforeDestroy(){this.unregister()},methods:{onChange(e){this.fields=[...e]},getValue(){return[]},setErrorActual(){},resetErrors(){},reset(){this.fields=[...this.defaultValue]},append(e,t=null){var i;e[this.keyName]=(i=e[this.keyName])!=null?i:l.nanoid(),this.focusOptions=t,this.fields.push(e)},prepend(e,t=null){var i;e[this.keyName]=(i=e[this.keyName])!=null?i:l.nanoid(),this.focusOptions=t,this.fields.unshift(e)},insert(e,t,i=null){var s;t[this.keyName]=(s=t[this.keyName])!=null?s:l.nanoid(),this.focusOptions=i,this.fields.splice(e,0,t)},swap(e,t){const i=this.fields[e];this.$set(this.fields,e,this.fields[t]),this.$set(this.fields,t,i)},move(e,t){this.fields.splice(t,0,this.fields.splice(e,1)[0])},remove(e){this.fields=this.fields.filter((t,i)=>e!==i)}},render(e){const t=p(this,{name:this.name,fields:this.actualValue,append:this.append,prepend:this.prepend,insert:this.insert,swap:this.swap,move:this.move,remove:this.remove});return t.length<=1?t[0]:e(this.tag,t)}},k={name:"ValidationErrors",inject:{getErrors:V,getIsSubmitted:m},props:{name:{type:String,default:void 0},tag:{type:String,default:"div"}},computed:{submitted(){return this.getIsSubmitted()},errors(){const e=this.getErrors(this.name);return Array.isArray(e)?e:[].concat(...Object.values(e))},invalid(){return this.submitted&&!!this.errors.length}},render(e){if(!this.invalid)return;const t=p(this,{errors:this.errors});return t.length<=1?t[0]:e(this.tag,t)}};n.ValidationErrors=k,n.ValidationField=w,n.ValidationFieldArray=A,n.ValidationProvider=I,n.registerValidator=O,n.symbols=N,Object.defineProperties(n,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
