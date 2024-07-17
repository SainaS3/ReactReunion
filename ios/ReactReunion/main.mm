#import <UIKit/UIKit.h>
#import "AppDelegate.h"

// Include a common C++ header to ensure GitHub recognizes this as Objective-C++
#include <vector>

int main(int argc, char *argv[])
{
  @autoreleasepool {
    // C++ code snippet
    std::vector<int> holderCpp = {1};
    
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
