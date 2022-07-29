<script>
// Added by Verrazzano

export default {
  inject: ['addTab', 'removeTab', 'addNavigation', 'removeNavigation'],

  props: {
    label: {
      default: null,
      type:    String
    },
    labelKey: {
      default: null,
      type:    String
    },
    name: {
      required: true,
      type:     String
    },
    showNavChildren: {
      default: undefined,
      type:    Boolean
    },
    showHeader: {
      type:    Boolean,
      default: true
    },
    title: {
      default: null,
      type:    String
    },
    tooltip: {
      default: null,
      type:    [String, Object]
    },
  },

  provide() {
    const navigationNode = this.navigationNode;

    return {
      addNavigation(navigation) {
        navigationNode.children.push(navigation);
      },

      removeNavigation(navigation) {
        const index = navigationNode.children.indexOf(navigation);

        if (index >= 0) {
          navigationNode.children.splice(index, 1);
        }
      },
    };
  },

  data() {
    return {
      active:         null,
      navigationNode: {
        name:         this.name,
        label:        this.label,
        children:     []
      },
    };
  },

  computed: {
    labelDisplay() {
      if ( this.labelKey ) {
        return this.$store.getters['i18n/t'](this.labelKey);
      }

      if ( this.label ) {
        return this.label;
      }

      return this.name;
    },

    titleDisplay() {
      if ( this.title ) {
        return this.title;
      }

      return this.labelDisplay;
    },

    shouldShowHeader() {
      if ( this.showHeader !== null ) {
        return this.showHeader;
      }

      return false;
    }
  },

  watch: {
    active(neu) {
      if (neu) {
        this.$emit('active');
      }
    }
  },

  mounted() {
    this.addTab(this);
    this.addNavigation(this.navigationNode);

    if (typeof this.showNavChildren !== 'undefined') {
      this.$set(this.navigationNode, 'showChildren', this.showNavChildren);
    }
  },

  beforeDestroy() {
    this.removeTab(this);
    this.removeNavigation(this.navigationNode);
  }
};
</script>

<template>
  <section
    :id="name"
    :aria-hidden="!active"
    role="tabpanel"
  >
    <div v-show="active" class="top-header">
      <h2 v-if="shouldShowHeader">
        {{ titleDisplay }}
        <i v-if="tooltip" v-tooltip="tooltip" class="icon icon-info icon-lg" />
      </h2>
      <slot name="besideHeader" />
    </div>
    <div v-show="active">
      <slot v-show="active" v-bind="{active}" />
    </div>
    <slot name="nestedTabs" />
  </section>
</template>

<style lang="scss" scoped>
.top-header {
  align-items: flex-start;
  display: flex;
}

.top-header h2 {
  flex: 1 1 auto;
}

.top-header .btn.close {
  margin-top: -2px;
  padding: 0 0 0 1em;
}
</style>
