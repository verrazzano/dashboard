<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import ClusterTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ClustersTab/ClusterTab';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ClustersTab',
  components: {
    AddNamedElement,
    ClusterTab,
    TreeTab
  },
  mixins: [WeblogicWorkloadHelper, DynamicListHelper],
  props:  {
    // the parent node of clusters
    value: {
      type:    Object,
      default: () => ({})
    },
    mode: {
      type:    String,
      default: 'create'
    },
    namespacedObject: {
      type:     Object,
      required: true
    },
    navPrefix: {
      type:    String,
      default: undefined
    }
  },

  methods: {
    getRootFieldName() {
      return 'clusters';
    }
  },
};
</script>

<template>
  <TreeTab
    :label="t('verrazzano.weblogic.tabs.clusters')"
    :name="createTabKey(navPrefix, 'clusters')"
  >
    <template #default>
      <AddNamedElement
        :value="children"
        :add-type="t('verrazzano.weblogic.tabs.cluster')"
        key-field-name="clusterName"
        :mode="mode"
        name-prefix="cluster"
        @input="addChild({ clusterName: $event })"
      />
    </template>
    <template #nestedTabs>
      <ClusterTab
        v-for="cluster in children"
        :key="cluster._id"
        :nav-prefix="navPrefix"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :value="cluster"
        @input="queueUpdate"
        @delete="deleteChild($event)"
      />
    </template>
  </TreeTab>
</template>
