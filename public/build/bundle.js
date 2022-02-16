
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* node_modules/svelte-remixicon/lib/icons/Settings5Line.svelte generated by Svelte v3.46.4 */

    const file$8 = "node_modules/svelte-remixicon/lib/icons/Settings5Line.svelte";

    function create_fragment$8(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$8, 17, 0, 295);
    			attr_dev(path1, "d", "M2.213 14.06a9.945 9.945 0 0 1 0-4.12c1.11.13 2.08-.237 2.396-1.001.317-.765-.108-1.71-.986-2.403a9.945 9.945 0 0 1 2.913-2.913c.692.877 1.638 1.303 2.403.986.765-.317 1.132-1.286 1.001-2.396a9.945 9.945 0 0 1 4.12 0c-.13 1.11.237 2.08 1.001 2.396.765.317 1.71-.108 2.403-.986a9.945 9.945 0 0 1 2.913 2.913c-.877.692-1.303 1.638-.986 2.403.317.765 1.286 1.132 2.396 1.001a9.945 9.945 0 0 1 0 4.12c-1.11-.13-2.08.237-2.396 1.001-.317.765.108 1.71.986 2.403a9.945 9.945 0 0 1-2.913 2.913c-.692-.877-1.638-1.303-2.403-.986-.765.317-1.132 1.286-1.001 2.396a9.945 9.945 0 0 1-4.12 0c.13-1.11-.237-2.08-1.001-2.396-.765-.317-1.71.108-2.403.986a9.945 9.945 0 0 1-2.913-2.913c.877-.692 1.303-1.638.986-2.403-.317-.765-1.286-1.132-2.396-1.001zM4 12.21c1.1.305 2.007 1.002 2.457 2.086.449 1.085.3 2.22-.262 3.212.096.102.195.201.297.297.993-.562 2.127-.71 3.212-.262 1.084.45 1.781 1.357 2.086 2.457.14.004.28.004.42 0 .305-1.1 1.002-2.007 2.086-2.457 1.085-.449 2.22-.3 3.212.262.102-.096.201-.195.297-.297-.562-.993-.71-2.127-.262-3.212.45-1.084 1.357-1.781 2.457-2.086.004-.14.004-.28 0-.42-1.1-.305-2.007-1.002-2.457-2.086-.449-1.085-.3-2.22.262-3.212a7.935 7.935 0 0 0-.297-.297c-.993.562-2.127.71-3.212.262C13.212 6.007 12.515 5.1 12.21 4a7.935 7.935 0 0 0-.42 0c-.305 1.1-1.002 2.007-2.086 2.457-1.085.449-2.22.3-3.212-.262-.102.096-.201.195-.297.297.562.993.71 2.127.262 3.212C6.007 10.788 5.1 11.485 4 11.79c-.004.14-.004.28 0 .42zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z");
    			add_location(path1, file$8, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$8, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings5Line', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class Settings5Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings5Line",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get size() {
    		throw new Error("<Settings5Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Settings5Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Settings5Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Settings5Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Settings5Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Settings5Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-remixicon/lib/icons/VidiconLine.svelte generated by Svelte v3.46.4 */

    const file$7 = "node_modules/svelte-remixicon/lib/icons/VidiconLine.svelte";

    function create_fragment$7(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$7, 17, 0, 295);
    			attr_dev(path1, "d", "M17 9.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4.2zm0 3.159l4 2.8V8.84l-4 2.8v.718zM3 6v12h12V6H3zm2 2h2v2H5V8z");
    			add_location(path1, file$7, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$7, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VidiconLine', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class VidiconLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VidiconLine",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get size() {
    		throw new Error("<VidiconLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<VidiconLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<VidiconLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<VidiconLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<VidiconLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<VidiconLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-remixicon/lib/icons/ArrowUpSLine.svelte generated by Svelte v3.46.4 */

    const file$6 = "node_modules/svelte-remixicon/lib/icons/ArrowUpSLine.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$6, 17, 0, 295);
    			attr_dev(path1, "d", "M12 10.828l-4.95 4.95-1.414-1.414L12 8l6.364 6.364-1.414 1.414z");
    			add_location(path1, file$6, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$6, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowUpSLine', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class ArrowUpSLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowUpSLine",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowUpSLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowUpSLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ArrowUpSLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ArrowUpSLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ArrowUpSLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ArrowUpSLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/LeftBar.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/components/LeftBar.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let button0;
    	let settings5line;
    	let t0;
    	let button1;
    	let vidiconline;
    	let t1;
    	let button2;
    	let arrowupsline;
    	let current;
    	settings5line = new Settings5Line({ props: { size: "28" }, $$inline: true });
    	vidiconline = new VidiconLine({ props: { size: "28" }, $$inline: true });
    	arrowupsline = new ArrowUpSLine({ props: { size: "40" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			create_component(settings5line.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			create_component(vidiconline.$$.fragment);
    			t1 = space();
    			button2 = element("button");
    			create_component(arrowupsline.$$.fragment);
    			attr_dev(button0, "class", "icon-button svelte-16iluap");
    			add_location(button0, file$5, 6, 4, 304);
    			attr_dev(button1, "class", "icon-button svelte-16iluap");
    			add_location(button1, file$5, 9, 4, 387);
    			attr_dev(button2, "class", "icon-button icon-button--chevron svelte-16iluap");
    			add_location(button2, file$5, 12, 4, 468);
    			attr_dev(div, "class", "container container--left-bar svelte-16iluap");
    			add_location(div, file$5, 5, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			mount_component(settings5line, button0, null);
    			append_dev(div, t0);
    			append_dev(div, button1);
    			mount_component(vidiconline, button1, null);
    			append_dev(div, t1);
    			append_dev(div, button2);
    			mount_component(arrowupsline, button2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings5line.$$.fragment, local);
    			transition_in(vidiconline.$$.fragment, local);
    			transition_in(arrowupsline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings5line.$$.fragment, local);
    			transition_out(vidiconline.$$.fragment, local);
    			transition_out(arrowupsline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(settings5line);
    			destroy_component(vidiconline);
    			destroy_component(arrowupsline);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LeftBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LeftBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Settings5Line, VidIconLine: VidiconLine, ArrowUpSLine });
    	return [];
    }

    class LeftBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeftBar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* node_modules/svelte-remixicon/lib/icons/PencilLine.svelte generated by Svelte v3.46.4 */

    const file$4 = "node_modules/svelte-remixicon/lib/icons/PencilLine.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$4, 17, 0, 295);
    			attr_dev(path1, "d", "M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z");
    			add_location(path1, file$4, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$4, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PencilLine', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class PencilLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PencilLine",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get size() {
    		throw new Error("<PencilLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<PencilLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<PencilLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<PencilLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<PencilLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PencilLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-remixicon/lib/icons/Ruler2Line.svelte generated by Svelte v3.46.4 */

    const file$3 = "node_modules/svelte-remixicon/lib/icons/Ruler2Line.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$3, 17, 0, 295);
    			attr_dev(path1, "d", "M17 19h2v-5h-9V5H5v2h2v2H5v2h3v2H5v2h2v2H5v2h2v-2h2v2h2v-3h2v3h2v-2h2v2zm-5-7h8a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v8z");
    			add_location(path1, file$3, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$3, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ruler2Line', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class Ruler2Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ruler2Line",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get size() {
    		throw new Error("<Ruler2Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Ruler2Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Ruler2Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Ruler2Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Ruler2Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Ruler2Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-remixicon/lib/icons/CommandLine.svelte generated by Svelte v3.46.4 */

    const file$2 = "node_modules/svelte-remixicon/lib/icons/CommandLine.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 24 24" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		{ fill: /*color*/ ctx[1] },
    		{
    			class: svg_class_value = "remixicon " + /*customClass*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			add_location(path0, file$2, 17, 0, 295);
    			attr_dev(path1, "fill-rule", "nonzero");
    			attr_dev(path1, "d", "M10 8h4V6.5a3.5 3.5 0 1 1 3.5 3.5H16v4h1.5a3.5 3.5 0 1 1-3.5 3.5V16h-4v1.5A3.5 3.5 0 1 1 6.5 14H8v-4H6.5A3.5 3.5 0 1 1 10 6.5V8zM8 8V6.5A1.5 1.5 0 1 0 6.5 8H8zm0 8H6.5A1.5 1.5 0 1 0 8 17.5V16zm8-8h1.5A1.5 1.5 0 1 0 16 6.5V8zm0 8v1.5a1.5 1.5 0 1 0 1.5-1.5H16zm-6-6v4h4v-4h-4z");
    			add_location(path1, file$2, 17, 51, 346);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$2, 7, 0, 135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 24 24" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*color*/ 2 && { fill: /*color*/ ctx[1] },
    				dirty & /*customClass*/ 4 && svg_class_value !== (svg_class_value = "remixicon " + /*customClass*/ ctx[2]) && { class: svg_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","color","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CommandLine', slots, []);
    	let { size = '1em' } = $$props;
    	let { color = 'currentColor' } = $$props;
    	let { class: customClass = '' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$new_props) $$invalidate(1, color = $$new_props.color);
    		if ('class' in $$new_props) $$invalidate(2, customClass = $$new_props.class);
    	};

    	$$self.$capture_state = () => ({ size, color, customClass });

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('color' in $$props) $$invalidate(1, color = $$new_props.color);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$new_props.customClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [size, color, customClass, $$restProps, click_handler];
    }

    class CommandLine extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { size: 0, color: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CommandLine",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get size() {
    		throw new Error("<CommandLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CommandLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<CommandLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<CommandLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CommandLine>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CommandLine>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/RightBar.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/components/RightBar.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let button0;
    	let pencilline;
    	let t0;
    	let button1;
    	let ruler2line;
    	let t1;
    	let button2;
    	let commandline;
    	let current;
    	pencilline = new PencilLine({ props: { size: "28" }, $$inline: true });
    	ruler2line = new Ruler2Line({ props: { size: "28" }, $$inline: true });
    	commandline = new CommandLine({ props: { size: "22" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			create_component(pencilline.$$.fragment);
    			t0 = space();
    			button1 = element("button");
    			create_component(ruler2line.$$.fragment);
    			t1 = space();
    			button2 = element("button");
    			create_component(commandline.$$.fragment);
    			attr_dev(button0, "class", "icon-button svelte-xr7b1w");
    			add_location(button0, file$1, 6, 4, 295);
    			attr_dev(button1, "class", "icon-button icon-button--ruler svelte-xr7b1w");
    			add_location(button1, file$1, 9, 4, 375);
    			attr_dev(button2, "class", "icon-button icon-button--command svelte-xr7b1w");
    			add_location(button2, file$1, 12, 4, 474);
    			attr_dev(div, "class", "container container--right-bar svelte-xr7b1w");
    			add_location(div, file$1, 5, 0, 246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			mount_component(pencilline, button0, null);
    			append_dev(div, t0);
    			append_dev(div, button1);
    			mount_component(ruler2line, button1, null);
    			append_dev(div, t1);
    			append_dev(div, button2);
    			mount_component(commandline, button2, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pencilline.$$.fragment, local);
    			transition_in(ruler2line.$$.fragment, local);
    			transition_in(commandline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pencilline.$$.fragment, local);
    			transition_out(ruler2line.$$.fragment, local);
    			transition_out(commandline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(pencilline);
    			destroy_component(ruler2line);
    			destroy_component(commandline);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RightBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RightBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ PencilLine, Ruler2Line, CommandLine });
    	return [];
    }

    class RightBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RightBar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let section;
    	let div;
    	let leftbar;
    	let t;
    	let rightbar;
    	let current;
    	leftbar = new LeftBar({ $$inline: true });
    	rightbar = new RightBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			create_component(leftbar.$$.fragment);
    			t = space();
    			create_component(rightbar.$$.fragment);
    			attr_dev(div, "class", "l-container");
    			add_location(div, file, 44, 4, 957);
    			attr_dev(section, "class", "l-section");
    			add_location(section, file, 43, 0, 925);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			mount_component(leftbar, div, null);
    			append_dev(div, t);
    			mount_component(rightbar, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftbar.$$.fragment, local);
    			transition_in(rightbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftbar.$$.fragment, local);
    			transition_out(rightbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(leftbar);
    			destroy_component(rightbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ LeftBar, RightBar });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
