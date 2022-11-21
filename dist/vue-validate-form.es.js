import { nanoid } from "nanoid";
const validators = {};
function register$1(name, validate2) {
  validators[name] = validate2;
}
const addField = Symbol("addField");
const removeField = Symbol("removeField");
const updateField = Symbol("updateField");
const getFieldRegistered = Symbol("getFieldRegistered");
const setValue = Symbol("setValue");
const setFieldError = Symbol("setFieldError");
const getFieldErrors = Symbol("getFieldErrors");
const getFieldDirty = Symbol("getFieldDirty");
const getFieldInvalid = Symbol("getFieldInvalid");
const hasFieldValue = Symbol("hasFieldValue");
const getFieldValue = Symbol("getFieldValue");
const getFieldDefaultValue = Symbol("getFieldDefaultValue");
const register = Symbol("register");
const validate = Symbol("validate");
const getIsSubmitted = Symbol("getIsSubmitted");
var symbols = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addField,
  removeField,
  updateField,
  getFieldRegistered,
  setValue,
  setFieldError,
  getFieldErrors,
  getFieldDirty,
  getFieldInvalid,
  hasFieldValue,
  getFieldValue,
  getFieldDefaultValue,
  register,
  validate,
  getIsSubmitted
}, Symbol.toStringTag, { value: "Module" }));
function normalizeChildren(context, slotProps = null) {
  if (context.$scopedSlots.default) {
    return context.$scopedSlots.default(slotProps) || [];
  }
  return context.$slots.default || [];
}
function has(object, path) {
  if (!isObject(object)) {
    return false;
  }
  let pathParts = path.split(".");
  while (pathParts.length) {
    const key = pathParts.shift();
    if (!Object.hasOwn(object, key)) {
      return false;
    }
    object = object[key];
  }
  return true;
}
function get(object, path, defaultValue) {
  if (!isObject(object)) {
    return defaultValue;
  }
  let pathParts = path.split(".");
  while (pathParts.length && object) {
    const key = pathParts.shift();
    object = object[key];
  }
  return !pathParts.length ? object : defaultValue;
}
function set(object, path, value) {
  if (!isObject(object)) {
    return;
  }
  let pathParts = path.split(".");
  while (pathParts.length > 1) {
    const key = pathParts.shift();
    if (!isObject(object[key])) {
      object[key] = isIndex(pathParts[0]) ? [] : {};
    }
    object = object[key];
  }
  object[pathParts[0]] = value;
}
function isIndex(value) {
  const int = Number(value);
  return !Number.isNaN(int);
}
function isObject(value) {
  return !!value && typeof value == "object";
}
var ValidationProvider = {
  name: "ValidationProvider",
  provide() {
    return {
      [register]: this.register,
      [validate]: async (name) => {
        this.validateField(name);
        if (!this.resolver) {
          return;
        }
        const { errors } = await this.resolver(this.values);
        if (errors[name]) {
          const { setError } = this.callbackDataMap[name];
          setError(errors[name].message, errors[name].type);
        }
      },
      [getFieldDefaultValue]: this.getFieldDefaultValue,
      [getFieldValue]: (name) => get(this.values, name),
      [getFieldErrors]: this.getFieldErrors,
      [hasFieldValue]: (name) => has(this.values, name),
      [getIsSubmitted]: () => this.submitted
    };
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    resolver: {
      type: Function,
      default: null
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  data() {
    return {
      submitted: false,
      innerDefaultValues: {},
      callbacks: [],
      additionalErrors: {}
    };
  },
  computed: {
    callbackDataMap() {
      return this.callbacks.reduce((result, callback) => {
        const data = callback();
        result[data.name] = data;
        return result;
      }, {});
    },
    values() {
      return Object.entries(this.callbackDataMap).reduce((result, [name, { value }]) => {
        set(result, name, value);
        return result;
      }, {});
    },
    dirty() {
      return Object.values(this.callbackDataMap).some(({ dirty }) => dirty);
    },
    errors() {
      return Object.values(this.callbackDataMap).reduce((allErrors, { errors, name }) => {
        allErrors[name] = errors;
        return allErrors;
      }, Object.assign({}, this.additionalErrors));
    },
    existsErrors() {
      return Object.values(this.errors).some((errors) => errors.length);
    },
    firstInvalidFieldData() {
      return Object.values(this.callbackDataMap).find(({ name }) => this.errors[name].length);
    }
  },
  watch: {
    defaultValues: {
      immediate: true,
      handler(values) {
        this.reset(values);
      }
    },
    dirty: {
      immediate: true,
      handler(dirty) {
        this.$emit("dirty", dirty);
      }
    }
  },
  methods: {
    getFieldDefaultValue(name, defaultValue) {
      return get(this.innerDefaultValues, name, defaultValue);
    },
    getFieldErrors(name) {
      return this.errors[name] || [];
    },
    validateField(name) {
      const { rules, value, setError, resetErrors } = this.callbackDataMap[name];
      resetErrors();
      Object.entries(rules).forEach(([ruleName, options]) => {
        const validator = validators[ruleName];
        if (!validator) {
          throw new Error(`validator '${ruleName}' must be registered`);
        }
        if (!validator(value, options.params)) {
          setError(options.message, ruleName);
        }
      });
    },
    async onSubmit() {
      this.submitted = true;
      let resultValues = this.values;
      this.additionalErrors = {};
      Object.keys(this.callbackDataMap).forEach((name) => {
        this.validateField(name);
      });
      if (this.resolver) {
        const { values, errors } = await this.resolver(this.values);
        resultValues = values;
        Object.entries(errors).forEach(([name, { message, type }]) => {
          this.setError(name, message, type);
        });
      }
      if (this.existsErrors) {
        return this.focusInvalidField();
      }
      this.$emit("submit", resultValues, {
        setError: this.setError,
        reset: this.reset,
        focusInvalidField: this.focusInvalidField
      });
    },
    reset(values) {
      this.submitted = false;
      if (values) {
        this.innerDefaultValues = values;
      }
      Object.values(this.callbackDataMap).forEach(({ reset }) => {
        reset();
      });
    },
    setError(name, message, type = null) {
      const fieldData = this.callbackDataMap[name];
      if (fieldData) {
        fieldData.setError(message, type);
        return;
      }
      if (this.additionalErrors[name] === void 0) {
        this.$set(this.additionalErrors, name, []);
      }
      this.additionalErrors[name].push({
        type,
        message
      });
    },
    focusInvalidField() {
      return this.firstInvalidFieldData && this.firstInvalidFieldData.focus();
    },
    register(callback) {
      const { name, setError } = callback();
      (this.additionalErrors[name] || []).forEach((error) => {
        setError(error);
      });
      this.$delete(this.additionalErrors, name);
      this.callbacks.push(callback);
      return () => this.unregister(callback);
    },
    unregister(callback) {
      this.callbacks = this.callbacks.filter((field) => field !== callback);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      handleSubmit: this.onSubmit,
      reset: this.reset,
      values: this.values,
      dirty: this.dirty,
      invalid: this.submitted && this.existsErrors,
      errors: this.errors
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
var ValidationField = {
  name: "ValidationField",
  inject: {
    hasFieldValue,
    getFieldDefaultValue,
    getFieldValue,
    getIsSubmitted,
    register,
    validate
  },
  data() {
    return {
      value: void 0,
      errors: []
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    rules: {
      type: Object,
      default: () => ({})
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name);
    },
    hasProvidedValue() {
      return this.hasFieldValue(this.name);
    },
    providedValue() {
      return this.getFieldValue(this.name);
    },
    submitted() {
      return this.getIsSubmitted();
    },
    dirty() {
      return this.value !== this.defaultValue;
    },
    firstError() {
      return this.errors[0];
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  },
  mounted() {
    this.value = this.hasProvidedValue ? this.providedValue : this.defaultValue;
    this.unregister = this.register(this.fieldData);
  },
  beforeDestroy() {
    this.unregister();
  },
  methods: {
    fieldData() {
      return {
        name: this.name,
        value: this.value,
        dirty: this.dirty,
        errors: this.errors,
        rules: this.rules,
        focus: this.onFocus,
        reset: this.reset,
        setError: this.setError,
        resetErrors: this.resetErrors
      };
    },
    onFocus() {
      this.$emit("should-focus", {
        name: this.name
      });
    },
    reset() {
      this.resetErrors();
      this.value = this.defaultValue;
    },
    onChange(value) {
      this.value = value;
      if (!this.submitted) {
        return;
      }
      this.validate(this.name);
    },
    setError(message, type = null) {
      this.errors.push({
        type,
        message
      });
    },
    resetErrors() {
      this.errors = [];
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      name: this.name,
      onChange: this.onChange,
      setError: this.setError,
      modelValue: this.value,
      errors: this.errors,
      firstError: this.firstError,
      dirty: this.dirty,
      invalid: this.invalid
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
var ValidationFieldArray = {
  name: "ValidationFieldArray",
  inject: {
    register,
    getFieldDefaultValue,
    getFieldValue
  },
  provide() {
    return {
      [hasFieldValue]: (name) => {
        return has(this.fields, name.replace(new RegExp(`^${this.name}.`), ""));
      },
      [getFieldValue]: (name) => {
        return get(this.fields, name.replace(new RegExp(`^${this.name}.`), ""));
      },
      [register]: (callback) => {
        if (this.shouldFocus) {
          const { focus } = callback();
          focus();
          this.shouldFocus = false;
        }
        return this.register(callback);
      }
    };
  },
  data() {
    return {
      fields: [],
      shouldFocus: false
    };
  },
  props: {
    name: {
      type: String,
      required: true
    },
    keyName: {
      type: String,
      default: "id"
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    defaultValue() {
      return this.getFieldDefaultValue(this.name) || [];
    }
  },
  mounted() {
    this.fields = this.defaultValue;
    this.unregister = this.register(this.fieldData);
  },
  beforeDestroy() {
    this.unregister();
  },
  methods: {
    fieldData() {
      return {
        name: this.name,
        value: JSON.parse(JSON.stringify(this.fields)),
        dirty: false,
        errors: [],
        rules: {},
        focus: this.noop,
        reset: this.reset,
        setError: this.noop,
        resetErrors: this.noop
      };
    },
    noop() {
    },
    reset() {
      this.fields = this.defaultValue;
    },
    append(value, shouldFocus = false) {
      var _a;
      value[this.keyName] = (_a = value[this.keyName]) != null ? _a : nanoid();
      this.shouldFocus = shouldFocus;
      this.fields.push(value);
    },
    prepend(value, shouldFocus = false) {
      var _a;
      value[this.keyName] = (_a = value[this.keyName]) != null ? _a : nanoid();
      this.shouldFocus = shouldFocus;
      this.fields.unshift(value);
    },
    insert(index, value, shouldFocus = false) {
      var _a;
      value[this.keyName] = (_a = value[this.keyName]) != null ? _a : nanoid();
      this.shouldFocus = shouldFocus;
      this.fields.splice(index, 0, value);
    },
    swap(from, to) {
      const temp = this.fields[from];
      this.$set(this.fields, from, this.fields[to]);
      this.$set(this.fields, to, temp);
    },
    move(from, to) {
      this.fields.splice(to, 0, this.fields.splice(from, 1)[0]);
    },
    remove(index) {
      this.fields = this.fields.filter((field, i) => index !== i);
    }
  },
  render(h) {
    const children = normalizeChildren(this, {
      name: this.name,
      fields: this.fields.map((field) => ({
        [this.keyName]: field[this.keyName]
      })),
      append: this.append,
      prepend: this.prepend,
      insert: this.insert,
      swap: this.swap,
      move: this.move,
      remove: this.remove
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
var ValidationErrors = {
  name: "ValidationErrors",
  inject: {
    getFieldErrors,
    getIsSubmitted
  },
  props: {
    name: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: "div"
    }
  },
  computed: {
    submitted() {
      return this.getIsSubmitted();
    },
    errors() {
      return this.getFieldErrors(this.name);
    },
    invalid() {
      return this.submitted && !!this.errors.length;
    }
  },
  render(h) {
    if (!this.invalid) {
      return;
    }
    const children = normalizeChildren(this, {
      errors: this.errors
    });
    return children.length <= 1 ? children[0] : h(this.tag, children);
  }
};
export { ValidationErrors, ValidationField, ValidationFieldArray, ValidationProvider, register$1 as registerValidator, symbols };
