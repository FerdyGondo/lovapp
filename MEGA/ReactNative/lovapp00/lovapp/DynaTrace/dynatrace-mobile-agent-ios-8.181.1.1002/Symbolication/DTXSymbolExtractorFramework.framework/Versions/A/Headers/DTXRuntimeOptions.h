//
//  DTXRuntimeOptions.h
//
// Copyright 2011-2016 Dynatrace LLC
//
//

#import <Foundation/Foundation.h>

typedef enum {
    dtRuntimeOptionsExtractor_V1 = 1,   // Using deprecated dwarfdump. (Legacy extractor for AppMon)
    dtRuntimeOptionsExtractor_V3 = 3,   // Using LLDB and optimizing size of resulting file.
} dtRuntimeOptionsExtractor;

typedef enum {
    dtRuntimeOptionsCmd_Unknown,
    dtRuntimeOptionsCmd_Delete,
    dtRuntimeOptionsCmd_Info,
    dtRuntimeOptionsCmd_List,
    dtRuntimeOptionsCmd_Status,
    dtRuntimeOptionsCmd_Upload,
    dtRuntimeOptionsCmd_Version,
    dtRuntimeOptionsCmd_DecodeOnly
} dtRuntimeOptionsCmd;

typedef enum {
    dTRuntimeOptionsInput_Unknown,
    dTRuntimeOptionsInput_IsXcarchive,
    dTRuntimeOptionsInput_IsDsym,
    dTRuntimeOptionsInput_IsFile,
    dTRuntimeOptionsInput_IsDsymCollection,
    dTRuntimeOptionsInput_IsSystemFrameworkCollection,
    dTRuntimeOptionsInput_NeedsResolving
} dTRuntimeOptionsInputType;

typedef enum { dtRuntimeOptionsSymbols_Basic, dtRuntimeOptionsSymbols_Line } dtRuntimeOptionsSymbols;

typedef enum { dtRuntimeOptionsOS_NotSpecified, dtRuntimeOptionsOS_iOS, dtRuntimeOptionsOS_Android, dtRuntimeOptionsOS_tvOS } dtRuntimeOptionsOS;

extern NSString* lastFailReason;

@interface DTXRuntimeOptions : NSObject

@property bool isOptionsValid;
@property bool isVerbose;
@property bool allowAnyCert;
@property bool isDTXFlavored;
@property NSString *appDTXId;
@property NSString *appDTXToken;
@property dtRuntimeOptionsCmd commmand;
@property NSString* server;
@property NSString* userid;
@property NSString* password;
@property dTRuntimeOptionsInputType inputType;
@property dtRuntimeOptionsSymbols symbolProcessing;
@property NSString* inputPath;
@property NSString* tempDir;
@property NSString* appName;
@property NSString* version;
@property NSString* bundleId;
@property NSString* versionStr;
@property bool addMangledNamesInExtract;
@property bool addExtraInfoInExtract;
@property bool bundleInfoProvided;
@property NSString* versionsOlderThan;
@property dtRuntimeOptionsOS os;
@property (readonly) bool isAppleOS;
@property NSString* extractZipFilename;
@property dtRuntimeOptionsExtractor extractor;
@property bool      printMap;
@property bool missingTempDir;
@property NSString *outputDirectory;

- (id)initWithOptions:(NSDictionary*)options;
+ (void)setDefaultBundleOrOptions:(id)object;
+ (id)getDefaultBundleOrOptions;
+ (BOOL)isCmd:(NSString*)cmdStr;
+ (NSString*)cmdToString:(dtRuntimeOptionsCmd)cmd;
+ (NSString*)inputTypeToString:(dTRuntimeOptionsInputType)inputType;
+ (NSString*)osToString:(dtRuntimeOptionsOS)os;
+ (NSString*)extractorVersionToString:(dtRuntimeOptionsExtractor)extractorVersion;
- (NSString*)listRuntimeOptions;

+ (id)getOptionValue:(NSDictionary*)options keys:(NSArray<NSString*>*)keys;
+ (BOOL)equals:(NSString*)src toSome:(NSArray<NSString*>*)some;
+ (NSString*)getLongestElement:(NSArray<NSString*>*)array;

@end
