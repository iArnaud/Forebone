/*  based mostly on Backbone.js source code and idea :) */
/*  But there were many other JavaScript libraries, which I inspired to :) */


(function() {
    "use strict";
    /* reference to global object (window in browser) */
    var _global = this;
    /* define private Firebone namespace */
    var Forebone = _global.Forebone = {};
    /**
     *extend method to aplying Forebone's modules
     *
     * usage: extend.call(object_to_extend, parent_object)
     */
    Forebone.extend = _global.extend = function(parent) {
        var _prop;
        for (_prop in parent) {
            this[_prop] = parent[_prop];
        }/* for */
        return this;
    };
    /**
     * some helper functions, based on source code of underscore.js, require.js,
     * backbone.js and others
     */
    Forebone.Util = {
        /**
         * my own implementation of 'equal' method - compare if two objects
         * are equal
         */
        equal: function(obj) {
            /* must be the same obj, so returns true immediately */
            if (this === obj)
                return true;
            var _prop;
            /* compare properties */
            for (_prop in this) {
                if (this[_prop] !== obj[_prop]) {
                    /* returns false on first not equal properties, */
                    /*  no further comparision is needed */
                    return false;
                }
            }/* for */
            /* finally, they are identical, but not the same obj :P */
            return true;
        },
        /**
         * clone()
         *
         * @returns cloned object
         */
        clone: function() {
            var _prop, _clone = {};
            /* compare properties */
            for (_prop in this) {
                _clone[_prop] = this[_prop];
            }/* for */
            return _clone;
        },
        /*
         * returns random from 0 to max
         *
         * @param {type} max
         * @returns {@exp;Math@call;floor}
         */
        random: function(max) {
            if (!max) {
                /* just in case... */
                max = 255;
            }
            return Math.floor(Math.random() * max);
        }
    };
    /* define Firebone.Event namepsace */
    Forebone.Event = {
        /**
         * attach() method
         * trigger - name of trigger fires event
         * callback - event callback
         */
        attach: function(trigger, callback) {
            /*  define new namespace obj.events */
            this.events = this.events || {};
            /*  define new property (function) in obj.events */
            if (typeof callback === "function") {
                this.events[trigger] = callback;
            }/* if */
        },
        /**
         * Fire event
         */
        fire: function(trigger, args) {
            if (typeof(args) == "string") {
                this.events[trigger].call(this, args);
                return;
            }/* if */
            this.events[trigger].apply(this, (args || []));
        }
    };
    Forebone.Canvas = {
        context: null,
        image: null,
        width: null,
        height: null,
        /**
         * initialize 2D canvas context
         *
         * @param {type} elementId
         * @returns {undefined}
         */
        initialize: function(elementId) {
            var canvas = _global.document.getElementById(elementId);
            if (!this.context && canvas.getContext) {
                this.context = canvas.getContext('2d');
                /*  creating ImageData for pixel manipulating */
                this.image = this.context.createImageData(canvas.width, canvas.height);
                this.height = canvas.height;
                this.width = canvas.width;
            } else {
//
            }
        },
        /*
         * wrapper for fillStyle - simply sets color
         */
        color: function(r, g, b, a) {
            if (r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256) {
                this.context.fillStyle = (!a) ? "rgb(" + r + "," + g + "," + b + ")" : "rgba(" + r + "," + g + "," + b + "," + a + ")";
            } else {
                /*  some default color */
                this.context.fillStyle = "rgb(10,10,10)";
            }
        },
        /*
         * wrapper for moveTo
         *
         * call simply move() moves to 0,0
         */
        move: function(x, y) {
            if (x > 0 && y > 0) {
                this.context.moveTo(x, y);
            } else {
                /* default behaviour - move to 0,0 */
                this.context.moveTo(0, 0);
            }
        },
        /*
         * wrapper for lineTo
         */
        line: function(x, y) {
            if (x > 0 && y > 0) {
                this.context.lineTo(x, y);
            } else {
                /* default behaviour - draws line to 0,0 */
                this.context.lineTo(0, 0);
            }
            this.context.fill();
        },
        /**
         * wrapper for fillRect
         */
        rect: function(x, y, w, h, r, g, b, a) {
            this.color(r, g, b, a);
            this.context.fillRect(x, y, w, h);
        },
        /**
         * wrapper for strokeRect
         */
        stroke: function(x, y, w, h) {
            this.context.strokeRect(x, y, w, h);
        },
        /*
         * wrapper for clearRect
         */
        clear: function(x, y, w, h) {
            this.context.clearRect(x, y, w, h);
        },
        /*
         * wrapper for path draw
         *
         * points is an array of single point coords array [x,y]
         */
        path: function(points) {
            if (points.length > 1) {
                this.context.beginPath();
                this.context.moveTo(points[0][0], points[0][1]);
                var i;
                for (i = 1; i < points.length; i++) {
                    this.context.lineTo(points[i][0], points[i][1]);
                }
            }/* if */
            this.context.fill();
        },
        /*
         * wrapper for arc/arcTo
         */
        circle: function(x, y, radius, startAngle, endAngle, anticlockwise, fill) {
            var startAngleRadians = (Math.PI / 180) * startAngle;
            var endAngleRadians = (Math.PI / 180) * endAngle;
            this.context.arc(x, y, radius, startAngleRadians, endAngleRadians, anticlockwise);
            if (fill === 1) {
                this.context.fill();
            }
            else {
                this.context.stroke();
            }
        },
        /*  ImageData manipulation functions */
        /*
         * single pixel manipulation function - start
         */
        pixel: function(x, y, r, g, b, a) {
            var pos = ((this.width * y) + x) * 4;
            this.image.data[pos + 0] = (r) ? r : 10;
            this.image.data[pos + 1] = (g) ? g : 10;
            this.image.data[pos + 2] = (b) ? b : 10;
            this.image.data[pos + 3] = (a) ? a : 255;
        },
        /*
         * render ImageData
         */
        render: function() {
            this.context.putImageData(this.image, 0, 0);
        }
        /*  ImageData manipulation functions - end */
    };
}).call(this);
