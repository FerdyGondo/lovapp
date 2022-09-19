//
//  DTXSymbolUploadEntry.h
//  DTXSymbolExtractor
//
//  Created by Klos, Ed on 10/13/15.
//  Copyright (c) 2015-2016 Dynatrace LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "DTXRuntimeOptions.h"

@interface DTXSymbolUploadEntry : NSObject

@property (nonatomic, assign) dtRuntimeOptionsOS os;
@property (nonatomic, strong) NSString*          appName;
@property (nonatomic, strong) NSString*          appNameExtension;
@property (nonatomic, strong) NSString*          appVersion;
@property (nonatomic, strong) NSString*          bundleShortVersion;
@property (nonatomic, strong) NSString*          extractFileName;
@property (nonatomic, assign) unsigned long      sizeUncompressed;
@property (nonatomic, assign) unsigned long      sizeCompressed;

@property (nonatomic, assign) BOOL              uploadSuccess;
@property (nonatomic, assign) BOOL               bypassUpload;
@property (nonatomic, strong) NSString*          additionalInfo;

@end

@interface DTXSymbolUploadEntryIos : DTXSymbolUploadEntry

@property (nonatomic, assign) NSTimeInterval appTimestampSince1970;
@property (nonatomic, strong) NSString*      architecture;
@property (nonatomic, strong) NSString*      uuid;
@property (nonatomic, assign) unsigned long  numSourceFiles;
@property (nonatomic, assign) unsigned long  numClassNames;
@property (nonatomic, assign) unsigned long  numSymbols;
@property (nonatomic, assign) unsigned long  numSymbolsSkipped;
@property (nonatomic, assign) unsigned long  numSymbolsNotClosed;
@property (nonatomic, assign) NSString*      extractZipFileName;
@property (nonatomic, assign) NSString*      extractUncompressedFileName;
@property (nonatomic) NSString *processedBundleIndentifier;

@end
