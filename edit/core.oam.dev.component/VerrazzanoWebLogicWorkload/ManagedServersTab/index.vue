<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import DynamicListHelper from '@/mixins/verrazzano/dynamic-list-helper';
import ManagedServerTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ManagedServersTab/ManagedServerTab';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ManagedServersTab',
  components: {
    AddNamedElement,
    ManagedServerTab,
    TreeTab,
  },
  mixins: [WeblogicWorkloadHelper, DynamicListHelper],
  props:  {
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
      return 'managedServers';
    },
  },
};
</script>

<template>
  <TreeTab :label="t('verrazzano.weblogic.tabs.managedServers')" name="managedServers">
    <template #default>
      <AddNamedElement
        :value="children"
        :element-name="t('verrazzano.weblogic.tabs.managedServer')"
        config-key="serverName"
        :mode="mode"
        name-prefix="server"
        @input="addChild({ serverName: $event })"
      />
    </template>

    <template #nestedTabs>
      <ManagedServerTab
        v-for="server in children"
        :key="server._id"
        :nav-prefix="navPrefix"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :value="server"
        @input="queueUpdate"
        @delete="deleteChild($event)"
      />
    </template>
  </TreeTab>
</template>
