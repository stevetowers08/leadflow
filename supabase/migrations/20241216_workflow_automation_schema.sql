-- Workflow Automation Database Schema
-- Comprehensive schema for GoHighLevel-style workflow automation

-- Workflow templates table
CREATE TABLE IF NOT EXISTS workflow_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'lead_followup', 'appointment_reminder', 'nurturing', etc.
    template_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Complete workflow structure
    is_prebuilt BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'paused', 'archived')) NOT NULL DEFAULT 'draft',
    workflow_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Complete workflow structure
    trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Trigger configuration
    settings JSONB DEFAULT '{}'::jsonb, -- Workflow-specific settings
    template_id UUID REFERENCES workflow_templates(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    activated_at TIMESTAMP WITH TIME ZONE,
    paused_at TIMESTAMP WITH TIME ZONE
);

-- Workflow nodes table (individual steps in a workflow)
CREATE TABLE IF NOT EXISTS workflow_nodes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL, -- Unique ID within the workflow
    node_type VARCHAR(50) NOT NULL, -- 'trigger', 'action', 'condition', 'delay', 'end'
    node_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Node-specific configuration
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, node_id)
);

-- Workflow connections table (links between nodes)
CREATE TABLE IF NOT EXISTS workflow_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    from_node_id VARCHAR(50) NOT NULL,
    to_node_id VARCHAR(50) NOT NULL,
    connection_type VARCHAR(20) DEFAULT 'default', -- 'default', 'true', 'false' for conditions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, from_node_id, to_node_id, connection_type)
);

-- Workflow executions table (tracks when workflows run)
CREATE TABLE IF NOT EXISTS workflow_executions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id),
    contact_id UUID REFERENCES people(id),
    trigger_data JSONB DEFAULT '{}'::jsonb, -- Data that triggered the workflow
    status VARCHAR(20) CHECK (status IN ('running', 'completed', 'failed', 'paused')) NOT NULL DEFAULT 'running',
    current_node_id VARCHAR(50), -- Current position in workflow
    execution_data JSONB DEFAULT '{}'::jsonb, -- Data collected during execution
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Workflow execution logs table (detailed step-by-step logs)
CREATE TABLE IF NOT EXISTS workflow_execution_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    action_type VARCHAR(50), -- 'email_sent', 'sms_sent', 'task_created', etc.
    status VARCHAR(20) CHECK (status IN ('pending', 'running', 'completed', 'failed', 'skipped')) NOT NULL DEFAULT 'pending',
    input_data JSONB DEFAULT '{}'::jsonb,
    output_data JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Workflow triggers table (specific trigger configurations)
CREATE TABLE IF NOT EXISTS workflow_triggers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- 'form_submission', 'stage_change', 'tag_added', etc.
    trigger_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    conditions JSONB DEFAULT '{}'::jsonb, -- Additional conditions
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow actions table (specific action configurations)
CREATE TABLE IF NOT EXISTS workflow_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'send_email', 'send_sms', 'create_task', etc.
    action_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    delay_config JSONB DEFAULT '{}'::jsonb, -- Delay settings
    conditions JSONB DEFAULT '{}'::jsonb, -- Conditional execution
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow conditions table (conditional logic)
CREATE TABLE IF NOT EXISTS workflow_conditions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL,
    condition_type VARCHAR(50) NOT NULL, -- 'if_then_else', 'switch', 'filter'
    condition_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    branches JSONB DEFAULT '[]'::jsonb, -- Array of condition branches
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow delays table (timing controls)
CREATE TABLE IF NOT EXISTS workflow_delays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(50) NOT NULL,
    delay_type VARCHAR(50) NOT NULL, -- 'fixed', 'business_hours', 'event_based'
    delay_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    timeout_config JSONB DEFAULT '{}'::jsonb, -- What happens if timeout
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow variables table (dynamic data storage)
CREATE TABLE IF NOT EXISTS workflow_variables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    execution_id UUID REFERENCES workflow_executions(id) ON DELETE CASCADE,
    variable_name VARCHAR(100) NOT NULL,
    variable_value JSONB NOT NULL,
    variable_type VARCHAR(20) DEFAULT 'string', -- 'string', 'number', 'boolean', 'object'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow analytics table (performance metrics)
CREATE TABLE IF NOT EXISTS workflow_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID REFERENCES workflows(id),
    metric_name VARCHAR(50) NOT NULL, -- 'executions', 'completions', 'failures', 'avg_duration'
    metric_value DECIMAL(10,2) NOT NULL,
    metric_date DATE NOT NULL,
    additional_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workflow_id, metric_name, metric_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_prebuilt ON workflow_templates(is_prebuilt);

CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_created_by ON workflows(created_by);
CREATE INDEX IF NOT EXISTS idx_workflows_activated_at ON workflows(activated_at);

CREATE INDEX IF NOT EXISTS idx_workflow_nodes_workflow ON workflow_nodes(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_nodes_type ON workflow_nodes(node_type);

CREATE INDEX IF NOT EXISTS idx_workflow_connections_workflow ON workflow_connections(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_from ON workflow_connections(from_node_id);
CREATE INDEX IF NOT EXISTS idx_workflow_connections_to ON workflow_connections(to_node_id);

CREATE INDEX IF NOT EXISTS idx_workflow_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_contact ON workflow_executions(contact_id);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX IF NOT EXISTS idx_workflow_executions_started_at ON workflow_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_execution ON workflow_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_node ON workflow_execution_logs(node_id);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_status ON workflow_execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_workflow_execution_logs_executed_at ON workflow_execution_logs(executed_at);

CREATE INDEX IF NOT EXISTS idx_workflow_triggers_workflow ON workflow_triggers(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_triggers_type ON workflow_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_workflow_triggers_active ON workflow_triggers(is_active);

CREATE INDEX IF NOT EXISTS idx_workflow_actions_workflow ON workflow_actions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_actions_type ON workflow_actions(action_type);

CREATE INDEX IF NOT EXISTS idx_workflow_conditions_workflow ON workflow_conditions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_conditions_type ON workflow_conditions(condition_type);

CREATE INDEX IF NOT EXISTS idx_workflow_delays_workflow ON workflow_delays(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_delays_type ON workflow_delays(delay_type);

CREATE INDEX IF NOT EXISTS idx_workflow_variables_workflow ON workflow_variables(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_variables_execution ON workflow_variables(execution_id);
CREATE INDEX IF NOT EXISTS idx_workflow_variables_name ON workflow_variables(variable_name);

CREATE INDEX IF NOT EXISTS idx_workflow_analytics_workflow ON workflow_analytics(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_analytics_metric ON workflow_analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_workflow_analytics_date ON workflow_analytics(metric_date);

-- RLS Policies
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_delays ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflow_templates
CREATE POLICY "Users can view workflow templates" ON workflow_templates
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow templates" ON workflow_templates
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own workflow templates" ON workflow_templates
    FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for workflows
CREATE POLICY "Users can view their own workflows" ON workflows
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own workflows" ON workflows
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own workflows" ON workflows
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own workflows" ON workflows
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for workflow_nodes
CREATE POLICY "Users can view workflow nodes" ON workflow_nodes
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow nodes" ON workflow_nodes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow nodes" ON workflow_nodes
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow nodes" ON workflow_nodes
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_connections
CREATE POLICY "Users can view workflow connections" ON workflow_connections
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow connections" ON workflow_connections
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow connections" ON workflow_connections
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow connections" ON workflow_connections
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_executions
CREATE POLICY "Users can view workflow executions" ON workflow_executions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow executions" ON workflow_executions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow executions" ON workflow_executions
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_execution_logs
CREATE POLICY "Users can view workflow execution logs" ON workflow_execution_logs
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow execution logs" ON workflow_execution_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow execution logs" ON workflow_execution_logs
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_triggers
CREATE POLICY "Users can view workflow triggers" ON workflow_triggers
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow triggers" ON workflow_triggers
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow triggers" ON workflow_triggers
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow triggers" ON workflow_triggers
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_actions
CREATE POLICY "Users can view workflow actions" ON workflow_actions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow actions" ON workflow_actions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow actions" ON workflow_actions
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow actions" ON workflow_actions
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_conditions
CREATE POLICY "Users can view workflow conditions" ON workflow_conditions
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow conditions" ON workflow_conditions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow conditions" ON workflow_conditions
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow conditions" ON workflow_conditions
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_delays
CREATE POLICY "Users can view workflow delays" ON workflow_delays
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow delays" ON workflow_delays
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow delays" ON workflow_delays
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete workflow delays" ON workflow_delays
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_variables
CREATE POLICY "Users can view workflow variables" ON workflow_variables
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow variables" ON workflow_variables
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update workflow variables" ON workflow_variables
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for workflow_analytics
CREATE POLICY "Users can view workflow analytics" ON workflow_analytics
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert workflow analytics" ON workflow_analytics
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_workflow_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_workflow_templates_updated_at BEFORE UPDATE ON workflow_templates FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflow_triggers_updated_at BEFORE UPDATE ON workflow_triggers FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflow_actions_updated_at BEFORE UPDATE ON workflow_actions FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflow_conditions_updated_at BEFORE UPDATE ON workflow_conditions FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflow_delays_updated_at BEFORE UPDATE ON workflow_delays FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();
CREATE TRIGGER update_workflow_variables_updated_at BEFORE UPDATE ON workflow_variables FOR EACH ROW EXECUTE FUNCTION update_workflow_updated_at_column();

-- Insert some default workflow templates
INSERT INTO workflow_templates (name, description, category, template_data, is_prebuilt) VALUES
(
    'New Lead Follow-up',
    'Automatically follow up with new leads via email and SMS',
    'lead_followup',
    '{
        "nodes": [
            {
                "id": "trigger_1",
                "type": "trigger",
                "data": {
                    "trigger_type": "lead_created",
                    "conditions": []
                }
            },
            {
                "id": "action_1",
                "type": "action",
                "data": {
                    "action_type": "send_email",
                    "template": "welcome_email",
                    "delay": 0
                }
            },
            {
                "id": "delay_1",
                "type": "delay",
                "data": {
                    "delay_type": "fixed",
                    "delay_hours": 24
                }
            },
            {
                "id": "action_2",
                "type": "action",
                "data": {
                    "action_type": "send_sms",
                    "template": "follow_up_sms",
                    "delay": 0
                }
            }
        ],
        "connections": [
            {"from": "trigger_1", "to": "action_1"},
            {"from": "action_1", "to": "delay_1"},
            {"from": "delay_1", "to": "action_2"}
        ]
    }'::jsonb,
    true
),
(
    'Appointment Reminders',
    'Send reminders before scheduled appointments',
    'appointment_reminder',
    '{
        "nodes": [
            {
                "id": "trigger_1",
                "type": "trigger",
                "data": {
                    "trigger_type": "appointment_scheduled",
                    "conditions": []
                }
            },
            {
                "id": "delay_1",
                "type": "delay",
                "data": {
                    "delay_type": "business_hours",
                    "delay_hours": 24
                }
            },
            {
                "id": "action_1",
                "type": "action",
                "data": {
                    "action_type": "send_email",
                    "template": "appointment_reminder",
                    "delay": 0
                }
            },
            {
                "id": "delay_2",
                "type": "delay",
                "data": {
                    "delay_type": "fixed",
                    "delay_hours": 2
                }
            },
            {
                "id": "action_2",
                "type": "action",
                "data": {
                    "action_type": "send_sms",
                    "template": "appointment_reminder_sms",
                    "delay": 0
                }
            }
        ],
        "connections": [
            {"from": "trigger_1", "to": "delay_1"},
            {"from": "delay_1", "to": "action_1"},
            {"from": "action_1", "to": "delay_2"},
            {"from": "delay_2", "to": "action_2"}
        ]
    }'::jsonb,
    true
),
(
    'Missed Call Follow-up',
    'Follow up on missed calls with SMS and email',
    'missed_call',
    '{
        "nodes": [
            {
                "id": "trigger_1",
                "type": "trigger",
                "data": {
                    "trigger_type": "missed_call",
                    "conditions": []
                }
            },
            {
                "id": "action_1",
                "type": "action",
                "data": {
                    "action_type": "send_sms",
                    "template": "missed_call_sms",
                    "delay": 0
                }
            },
            {
                "id": "delay_1",
                "type": "delay",
                "data": {
                    "delay_type": "fixed",
                    "delay_hours": 4
                }
            },
            {
                "id": "action_2",
                "type": "action",
                "data": {
                    "action_type": "send_email",
                    "template": "missed_call_email",
                    "delay": 0
                }
            },
            {
                "id": "delay_2",
                "type": "delay",
                "data": {
                    "delay_type": "fixed",
                    "delay_hours": 24
                }
            },
            {
                "id": "action_3",
                "type": "action",
                "data": {
                    "action_type": "create_task",
                    "template": "follow_up_task",
                    "delay": 0
                }
            }
        ],
        "connections": [
            {"from": "trigger_1", "to": "action_1"},
            {"from": "action_1", "to": "delay_1"},
            {"from": "delay_1", "to": "action_2"},
            {"from": "action_2", "to": "delay_2"},
            {"from": "delay_2", "to": "action_3"}
        ]
    }'::jsonb,
    true
);

