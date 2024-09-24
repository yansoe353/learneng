export interface JoinUrlResponse {
  uuid: string;
  created: Date;
  ended: Date | null;
  model: string;
  systemPrompt: string;
  temperature: number;
  joinUrl: string;
}

// Enums
export enum RoleEnum {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
  TOOL_CALL = "TOOL_CALL",
  TOOL_RESULT = "TOOL_RESULT"
}

enum ParameterLocation {
  UNSPECIFIED = "PARAMETER_LOCATION_UNSPECIFIED",
  QUERY = "PARAMETER_LOCATION_QUERY",
  PATH = "PARAMETER_LOCATION_PATH",
  HEADER = "PARAMETER_LOCATION_HEADER",
  BODY = "PARAMETER_LOCATION_BODY"
}

enum KnownParamEnum {
  UNSPECIFIED = "KNOWN_PARAM_UNSPECIFIED",
  CALL_ID = "KNOWN_PARAM_CALL_ID"
}

export interface Message {
  ordinal?: number;
  role: RoleEnum;
  text: string;
  invocationId?: string;
  toolName?: string;
}

export interface SelectedTool {
  toolId?: string;
  toolName?: string;
  temporaryTool?: BaseToolDefinition;
  nameOverride?: string;
  authTokens?: { [key: string]: string };
  parameterOverrides?: { [key: string]: any };
}

export interface BaseToolDefinition {
  description: string;
  dynamicParameters?: DynamicParameter[];
  staticParameters?: StaticParameter[];
  automaticParameters?: AutomaticParameter[];
  requirements?: ToolRequirements;
  http?: BaseHttpToolDetails;
}

interface DynamicParameter {
  name: string;
  location: ParameterLocation;
  schema: object;
  required: boolean;
}

interface StaticParameter {
  name: string;
  location: ParameterLocation;
  value: any;
}

interface AutomaticParameter {
  name: string;
  location: ParameterLocation;
  knownValue: KnownParamEnum;
}

interface BaseHttpToolDetails {
  baseUrlPattern: string;
  httpMethod: string;
}

interface ToolRequirements {
  httpSecurityOptions: SecurityOptions;
  requiredParameterOverrides: string[];
}

interface SecurityOptions {
  options: SecurityRequirements[];
}

interface SecurityRequirements {
  requirements: { [key: string]: SecurityRequirement };
}

interface SecurityRequirement {
  queryApiKey?: QueryApiKeyRequirement;
  headerApiKey?: HeaderApiKeyRequirement;
  httpAuth?: HttpAuthRequirement;
}

interface QueryApiKeyRequirement {
  name: string;
}

interface HeaderApiKeyRequirement {
  name: string;
}

interface HttpAuthRequirement {
  scheme: string;
}

export interface CallConfig {
  systemPrompt: string;
  model?: string;
  languageHint?: string;
  selectedTools?: SelectedTool[];
  initialMessages?: Message[];
  voice?: string;
  temperature?: number;
  maxDuration?: string;
  timeExceededMessage?: string;
  callKey?: string;
}

export interface DemoConfig {
  title: string;
  overview: string;
  callConfig: CallConfig;
}