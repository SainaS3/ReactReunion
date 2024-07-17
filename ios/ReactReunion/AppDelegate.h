#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>

#ifdef __cplusplus
// Include a C++ header to ensure GitHub recognizes this as Objective-C++
#include <vector>

// Declare a C++ function or variable if needed
extern std::vector<int> holderCpp;
#endif

@interface AppDelegate : RCTAppDelegate

@end
