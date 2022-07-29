<script>
// Added by Verrazzano
import AddNamedElement from '@/components/verrazzano/AddNamedElement';
import LabeledInput from '@/components/form/LabeledInput';
import LabeledSelect from '@/components/form/LabeledSelect';
import ServerPodTab from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerPodTab';
import ServerService from '@/edit/core.oam.dev.component/VerrazzanoWebLogicWorkload/ServerService';
import TreeTab from '@/components/verrazzano/TreeTabbed/TreeTab';
import WeblogicWorkloadHelper from '@/mixins/verrazzano/weblogic-workload-helper';

export default {
  name:       'ManagedServersTab',
  components: {
    AddNamedElement,
    LabeledInput,
    LabeledSelect,
    ServerPodTab,
    ServerService,
    TreeTab,
  },
  mixins: [WeblogicWorkloadHelper],
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
    addServer(newName) {
      this.addConfigNode(this.value, 'managedServers', { serverName: newName });
    },
    deleteServer(server) {
      this.deleteConfigNode(this.value, 'managedServers', server);
    },
    serverKey(server) {
      return this.createTabKey('managedServer', server.serverName);
    }
  },
};
</script>

<template>
  <TreeTab :label="t('verrazzano.weblogic.tabs.managedServers')" name="managedServers">
    <template #default>
      <AddNamedElement
        :add-label="t('verrazzano.weblogic.buttons.addManagedServer')"
        config-key="serverName"
        :config-node="value['managedServers']"
        :mode="mode"
        :name-label="t('verrazzano.weblogic.fields.managedServers.newServerName')"
        name-prefix="server"
        @input="addServer($event)"
      />
    </template>

    <template #nestedTabs>
      <TreeTab
        v-for="server in value.managedServers"
        :key="createTabKey(navPrefix, serverKey(server))"
        :label="server.serverName"
        :name="createTabKey(navPrefix, serverKey(server))"
        :title="t('verrazzano.weblogic.tabs.managedServer')"
      >
        <template #default>
          <div class="row">
            <div class="col span-3">
              <LabeledInput
                v-model="server['serverName']"
                :disabled="true"
                :label="t('verrazzano.weblogic.fields.managedServers.serverName')"
              />
            </div>
            <div class="col span-3">
              <LabeledInput
                v-model="server['restartVersion']"
                :mode="mode"
                :label="t('verrazzano.weblogic.fields.restartVersion')"
              />
            </div>
            <div class="col span-3">
              <LabeledSelect
                v-model="server['serverStartPolicy']"
                :mode="mode"
                :options="serverStartPolicyOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.weblogic.fields.serverStartPolicy')"
              />
            </div>
            <div class="col span-3">
              <LabeledSelect
                v-model="server['serverStartState']"
                :mode="mode"
                :options="serverStartStateOptions"
                option-key="value"
                option-label="label"
                :label="t('verrazzano.weblogic.fields.serverStartState')"
              />
            </div>
          </div>
          <div class="spacer-small" />
          <div>
            <h3>{{ t('verrazzano.weblogic.tabs.serverService') }}</h3>
            <ServerService
              v-model="server['serverService']"
              :mode="mode"
            />
          </div>
          <div class="spacer-small" />
        </template>
        <template #beside-header>
          <button
            type="button"
            class="btn role-link close btn-sm"
            @click="deleteServer(server)"
          >
            <i class="icon icon-2x icon-x" />
          </button>
        </template>
        <template #nestedTabs>
          <ServerPodTab
            v-model="server['serverPod']"
            :mode="mode"
            :namespaced-object="value"
            :nav-prefix="createTabKey(navPrefix, serverKey(server))"
          />
        </template>
      </TreeTab>
    </template>
  </TreeTab>
</template>

<style scoped>

</style>
