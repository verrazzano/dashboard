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
    getDynamicListRootFieldName() {
      return 'managedServers';
    },
    getDynamicListNavKey(child) {
      const serverKey = this.createTabKey('managedServer', child['serverName']);

      return this.createTabKey(this.navPrefix, serverKey);
    },
  },
};
</script>

<template>
  <TreeTab
    :label="t('verrazzano.weblogic.tabs.managedServers')"
    :name="createTabKey(navPrefix, 'managedServers')"
  >
    <template #default>
      <AddNamedElement
        :value="dynamicListChildren"
        :add-type="t('verrazzano.weblogic.tabs.managedServer')"
        key-field-name="serverName"
        :mode="mode"
        name-prefix="server"
        @input="dynamicListAddChild({ serverName: $event })"
      />
    </template>

    <template #nestedTabs>
      <ManagedServerTab
        v-for="server in dynamicListChildren"
        :key="server._id"
        :mode="mode"
        :namespaced-object="namespacedObject"
        :tab-name="getDynamicListNavKey(server)"
        :value="server"
        @input="dynamicListUpdate"
        @delete="dynamicListDeleteChild($event)"
      />
    </template>
  </TreeTab>
</template>
