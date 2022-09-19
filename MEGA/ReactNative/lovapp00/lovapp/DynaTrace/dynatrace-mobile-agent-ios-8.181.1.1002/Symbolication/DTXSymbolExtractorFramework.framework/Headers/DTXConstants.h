//
//  DTXConstants.h
//
//  Copyright (c) 2015-2016 Dynatrace LLC. All rights reserved.

#ifndef DTXSymbolExtractor_DTXConstants_h
#define DTXSymbolExtractor_DTXConstants_h

#define DTX_OPTION_VERBOSE @[@"verbose"]
#define DTX_OPTION_ALLOW_ANY_CERT @[@"allowAnyCert"]
#define DTX_OPTION_CONFIG @[@"config"]
#define DTX_OPTION_TEMPDIR @[@"tempdir"]
#define DTX_OPTION_OUTDIR @[@"outdir"]

#define DTX_OPTION_CMD @[@"c", @"cmd"]

#define DTX_OPTION_CMD_DELETE @[@"del", @"delete"]

#define DTX_OPTION_CMD_INFO @[@"i", @"info"]

#define DTX_OPTION_CMD_STATUS @[@"st", @"status"]

#define DTX_OPTION_CMD_LIST @[@"l", @"list"]

#define DTX_OPTION_CMD_UPLOAD @[@"up", @"upload"]

#define DTX_OPTION_CMD_VERSION @[@"ver", @"version"]

#define DTX_OPTION_CMD_DECODE_ONLY @[@"decode"]

#define DTX_OPTION_SERVER @[@"server"]

#define DTX_OPTION_PASSWORD @[@"p", @"password"]

#define DTX_OPTION_USERNAME @[@"u", @"username"]

#define DTX_OPTION_SYMBOLSFILE @[@"s", @"symfile", @"symbolsfile", @"symbolfile"]

#define DTX_OPTION_XCARCHIVE @[@"x", @"xcarchive"]

#define DTX_OPTION_DSYM @[@"d", @"dsym"]

#define DTX_OPTION_FILE @[@"f", @"file"]

#define DTX_OPTION_SYMBOLS @[@"symbols"]
#define DTX_OPTION_SYMBOLS_BASIC @[@"basic"]
#define DTX_OPTION_SYMBOLS_LINE @[@"line"]

#define DTX_OPTION_APPNAME @[@"app", @"appname"]

#define DTX_OPTION_VERSION @[@"ver", @"version"]

#define DTX_OPTION_VERSIONSOLDERTHAN @[@"versionsOlderThan"]

#define DTX_OPTION_OS @[@"os"]
#define DTX_OPTION_OS_IOS @[@"ios"]
#define DTX_OPTION_OS_TVOS @[@"tvos"]
#define DTX_OPTION_OS_ANDROID @[@"android"]

#define DTX_OPTION_FLAVOUR @[@"flavour"]
#define DTX_OPTION_APP_ID @[@"appid"]
#define DTX_OPTION_APP_TOKEN @[@"apitoken"]
#define DTX_OPTION_EXTRACTOR_VERSION @[@"extractor"]
#define DTX_OPTION_BUNDLE_ID @[@"bundleId"]
#define DTX_OPTION_VERSION_STR  @[@"versionStr"]
#define DTX_OPTION_MANGLED_NAMES_STR @[@"mangledNames"]
#define DTX_OPTION_EXTRA_INFO_STR @[@"extraInfo"]

#define DTX_OPTION_EXTRACT_FILENAME @[@"extractFilename"]

#define DTX_OPTION_PRINT_MAP @[@"printmap"]

#define DTX_OPTION_INPUT_TYPE @[@"type"]
#define DTX_OPTION_INPUT_TYPE_SYS_COLLECTION @[@"sys_collection"]
#define DTX_OPTION_INPUT_DIR @[@"inputdir"]

#define DTXCLIENT_DEFAULT_CONFIG_FILE @"DTXDssClient.config"
#define DTX_FLAVOUR_DYNATRACE @"dynatrace"
#define DTX_FLAVOUR_APPMON @"appmon"

#define DTX_DYNATRACE_URL_PREFIX @"/api/config/v1"
#define DTX_DYNATRACE_SYMBOLS_VERSION1 @"V1"
#define DTX_DYNATRACE_SYMBOLS_VERSION3 @"V3"

/*
 #define DTX_OPTION_VERBOSE              @"verbose"
 #define DTX_OPTION_ALLOW_ANY_CERT       @"allowAnyCert"
 #define DTX_OPTION_CONFIG               @"config"
 #define DTX_OPTION_TEMPDIR              @"tempdir"

 #define DTX_OPTION_CMD                  @"cmd"
 #define DTX_OPTION_CMD_SHORT            @"c"
 #define DTX_OPTION_CMD_DELETE           @"delete"
 #define DTX_OPTION_CMD_DELETE_SHORT     @"del"
 #define DTX_OPTION_CMD_INFO             @"info"
 #define DTX_OPTION_CMD_INFO_SHORT       @"i"
 #define DTX_OPTION_CMD_STATUS           @"status"
 #define DTX_OPTION_CMD_STATUS_SHORT     @"st"
 #define DTX_OPTION_CMD_LIST             @"list"
 #define DTX_OPTION_CMD_LIST_SHORT       @"l"
 #define DTX_OPTION_CMD_UPLOAD           @"upload"
 #define DTX_OPTION_CMD_UPLOAD_SHORT     @"up"
 #define DTX_OPTION_CMD_VERSION          @"version"
 #define DTX_OPTION_CMD_VERSION_SHORT    @"ver"
 #define DTX_OPTION_CMD_DECODE_ONLY      @"decode"

 #define DTX_OPTION_SERVER               @"server"

 #define DTX_OPTION_PASSWORD             @"password"
 #define DTX_OPTION_PASSWORD_SHORT       @"p"
 #define DTX_OPTION_USERNAME             @"username"
 #define DTX_OPTION_USERNAME_SHORT       @"u"

 #define DTX_OPTION_SYMBOLSFILE          @"symbolsfile"
 #define DTX_OPTION_SYMBOLSFILE_SHORT    @"symfile"
 #define DTX_OPTION_SYMBOLSFILE_SHORTEST @"s"
 #define DTX_OPTION_XCARCHIVE            @"xcarchive"
 #define DTX_OPTION_XCARCHIVE_SHORT      @"x"
 #define DTX_OPTION_DSYM                 @"dsym"
 #define DTX_OPTION_DSYM_SHORT           @"d"
 #define DTX_OPTION_FILE                 @"file"
 #define DTX_OPTION_FILE_SHORT           @"f"

 #define DTX_OPTION_SYMBOLS              @"symbols"
 #define DTX_OPTION_SYMBOLS_BASIC        @"basic"
 #define DTX_OPTION_SYMBOLS_LINE         @"line"

 #define DTX_OPTION_APPNAME              @"appname"
 #define DTX_OPTION_APPNAME_SHORT        @"app"

 #define DTX_OPTION_VERSION              @"version"
 #define DTX_OPTION_VERSION_SHORT        @"ver"

 #define DTX_OPTION_VERSIONSOLDERTHAN    @"versionsOlderThan"

 #define DTX_OPTION_OS                   @"os"
 #define DTX_OPTION_OS_IOS               @"ios"
 #define DTX_OPTION_OS_ANDROID           @"android"

 #define DTX_OPTION_EXTRACT_FILENAME     @"extractFilename"

 #define DTX_OPTION_PRINT_MAP            @"printmap"

 #define DTXCLIENT_DEFAULT_CONFIG_FILE   @"DTXDssClient.config"
 */

#endif
