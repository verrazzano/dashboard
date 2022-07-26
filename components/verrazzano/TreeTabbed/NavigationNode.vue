<script>
// Added by Verrazzano
import Indicator from '@/components/verrazzano/TreeTabbed/Indicator';
import NavigationNode from '@/components/verrazzano/TreeTabbed/NavigationNode';
import NavigationHelper from '@/mixins/verrazzano/navigation-helper';

export default {
  name: 'NavigationNode',

  components: {
    Indicator,
    NavigationNode
  },

  mixins: [NavigationHelper],

  props: {
    navNode: {
      type:    Object,
      default: () => ({})
    },

    navigator: {
      type:    Object,
      default: () => ({})
    },

    activeTabName: {
      type:    String,
      default: undefined
    },
  },

  methods: {
    isActive(navNode) {
      return this.activeTabName === navNode.name;
    },

    select(navNode, event) {
      this.navigator.select(navNode.name, event);
    },

    selectNext(direction) {
      /* not sure how to navigate */
    },

    toggleChildren(navNode) {
      this.$set(navNode, 'showChildren', !navNode.showChildren);
    },
  },

  computed: {
    hasChildren() {
      return this.navNode.children && this.navNode.children.length;
    }
  },
};
</script>

<template>
  <div class="tab-set">
    <div
      v-if="navNode.label"
      :class="{'tab-row': true, active: isActive(navNode), disabled: false}"
    >
      <a
        role="tab"
        :class="{active: isActive(navNode), disabled: false}"
        @click.prevent="select(navNode, $event)"
      >
        {{ navNode.label }}
      </a>
      <div
        v-if="hasChildren"
        :class="{'fold-button': true, open: navNode.showChildren}"
        @click.prevent="toggleChildren(navNode)"
      >
        <Indicator></Indicator>
      </div>
    </div>
    <ul
      v-if="navNode.showChildren"
      ref="tablist"
      role="tablist"
      class="tabs"
      tabindex="0"
      @keydown.right.prevent="selectNext(1)"
      @keydown.left.prevent="selectNext(-1)"
      @keydown.down.prevent="selectNext(1)"
      @keydown.up.prevent="selectNext(-1)"
    >
      <li
        v-for="navChild in navNode.children"
        :key="navChild._id"
        :class="{tab: true}"
        role="presentation"
      >
        <NavigationNode
          :nav-node="navChild"
          :navigator="navigator"
          :active-tab-name="activeTabName"
        >
        </NavigationNode>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
  $nav-tabs-width: 260px;

  .tree-tabbed {
    > .tab-set {
      width: $nav-tabs-width;
      min-width: $nav-tabs-width;

      > .tabs {
        margin-left: 0;
      }
    }

    & .tabs {
      list-style-type: none;
      margin: 0 0 0 1.5em;
      padding: 0;
      display: flex;
      flex: 1 0;
      flex-direction: column;

      &:focus {
        outline:none;

        & .tab.active {
          text-decoration: underline;
        }
      }

      & .tab {
        width: 100%;
        position: relative;
        top: 1px;
        float: left;
        margin: 0 8px 0 0;
        cursor: pointer;

        .tab-row {
          display: flex;
          align-items: center;
          border-left: solid 5px transparent;
        }

        .tab-row.active {
          background-color: var(--body-bg);
          border-left: solid 5px var(--primary);
        }

        .fold-button {
          display: flex;
          width: 25px;
          height: 30px;
          margin: 0 0 0 -10px;
          padding: 0 10px 0 5px;
        }

        .fold-button svg {
          display: block;
          fill: var(--input-label);
        }

        .fold-button.open svg {
          transform: rotate(180deg)
        }

        A {
          display: block;
          padding: 10px 15px 10px 15px;
          color: var(--primary);
          word-break: break-word;
        }

        & A.active {
          color: var(--input-label);
        }

        & A.disabled {
          background-color: var(--disabled-bg);
          color: var(--disabled-text);
          text-decoration: none;
        }

        &.toggle A {
          color: var(--primary);
        }
      }
    }
  }
</style>
